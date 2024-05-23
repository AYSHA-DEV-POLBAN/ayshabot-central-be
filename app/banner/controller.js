
const Banner = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
module.exports = {
    index: async (req, res) => {
        try {
            const banner = await Banner.findAll({
                where: {
                  status_id: 1
                }
              });
            res.status(200).json({ data: banner });
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
    },
    actionCreated: async (req, res, next) => {

        try {
            const payload = req.body;
            if (req.file) {
                let temp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);
                const src = fs.createReadStream(temp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)
                src.on('end', async () => {
                    try {
                        const banner = new Banner({
                            ...payload,
                            image: filename,
                            updatedAt: null,
                            deletedAt: null
                        });
                        await banner.save();
                        delete banner.password;
                        res.status(200).json({
                            data: banner
                        })
                    } catch (err) {

                        if (err && err.name === 'SequelizeValidationError') {
                            return res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            })
                        }
                        next(err)
                    }
                });
            } else {
                try {

                    console.log('====================================');
                    console.log('payload', payload);
                    console.log('====================================');
                    let banner = new Banner({
                        ...payload,
                        updatedAt: null,
                        deletedAt: null
                    });
                    await banner.save()
                    delete banner.password;
                    res.status(200).json({
                        data: banner
                    });
                } catch (err) {
                    if (err && err.name === 'SequelizeValidationError') {
                        return res.status(422).json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err)
                }
            }
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
    },
    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            let banner = await Banner.findOne({ where: { id: id } });
            let currentImage = `${config.rootPath}/public/uploads/${banner.image}`;
            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
            }

            await Banner.update({ status_id: 0 }, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        message: "Berhasil Hapus Banner"
                    })
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(422).json({
                        error: 1,
                        message: err.message,
                        fields: err.errors
                    })
                });
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
    },
    actionEdit: async (req, res, next) => {
        const { id } = req.params;

        try {
            const { title = "", description = "" } = req.body;
            const payload = {};
            if (title.length) payload.title = title;
            if (description.length) payload.description = description;
            if (req.file) {
                let temp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(temp_path);
                const dest = fs.createWriteStream(target_path);
                src.pipe(dest)
                src.on('end', async () => {

                    let banner = await Banner.findOne({ where: { id: id } });


                    let currentImage = `${config.rootPath}/public/uploads/${banner.image}`;
                    console.log('currentImage', currentImage);
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }


                    banner = await Banner.update({ title: title, description: description, image: filename }, { where: { id: id } })
                        .then((updatedRows) => {
                            console.log(`${updatedRows} rows updated successfully.`);
                            res.status(201).json({
                                data: {
                                    id: id,
                                    title: title,
                                    description: description,
                                    image: filename
                                }
                            })
                        })
                        .catch((err) => {
                            console.error('Error:', err);
                            res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            })
                        });

                })
                src.on('err', async () => {
                    next(err)
                })
            } else {
                let banner = await Banner.findOne({ where: { id: id } });
                banner = await Banner.update({ title: title, description: description }, { where: { id: id } })
                    .then((updatedRows) => {
                        console.log(`${updatedRows} rows updated successfully.`);
                        res.status(201).json({
                            data: {
                                id: id,
                                title: title,
                                description: description

                            }
                        })
                    })
                    .catch((err) => {
                        console.error('Error:', err);
                        res.status(422).json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    });
            }

        } catch (err) {
            if (err && err.name === "ValidationError") {
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
        }

    }

}