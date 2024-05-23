
const Facility = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
module.exports = {
    index: async (req, res) => {
        try {
            const facility = await Facility.findAll({
                where: {
                  status_id: '1'
                }
              });
            res.status(200).json({ data: facility });
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
                        const facility = new Facility({
                            ...payload,
                            icon: filename,
                            updatedAt: null,
                            deletedAt: null
                        });
                        await facility.save();
                        delete facility.password;
                        res.status(200).json({
                            data: facility
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
                    let facility = new Facility({
                        ...payload,
                        updatedAt: null,
                        deletedAt: null
                    });
                    await facility.save()
                    delete facility.password;
                    res.status(200).json({
                        data: facility
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

            let facility = await Facility.findOne({ where: { id: id } });
            let currentImage = `${config.rootPath}/public/uploads/${facility.icon}`;
            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
            }

            await Facility.update({ status_id: 0 }, { where: { id: id } })
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
            const { name = "" } = req.body;
            const payload = {};
            if (name.length) payload.name = name;
           
            if (req.file) {
                let temp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(temp_path);
                const dest = fs.createWriteStream(target_path);
                src.pipe(dest)
                src.on('end', async () => {

                    let facility = await Facility.findOne({ where: { id: id } });


                    let currentImage = `${config.rootPath}/public/uploads/${facility.icon}`;
                    console.log('currentImage', currentImage);
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }


                    facility = await Facility.update({ name: name, icon: filename }, { where: { id: id } })
                        .then((updatedRows) => {
                            console.log(`${updatedRows} rows updated successfully.`);
                            res.status(201).json({
                                data: {
                                    id: id,
                                    name: name,
                                    icon: filename
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
               
                await Facility.update({ name: name }, { where: { id: id } })
                    .then((updatedRows) => {
                        console.log(`${updatedRows} rows updated successfully.`);
                        res.status(201).json({
                            data: {
                                id: id,
                                name: name,
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