const Information = require("./model");
const CategoryInformation = require("../categoryInformation/model");
const Chroma = require("../chroma/model");
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const { logHistoryCreated } = require('../logHistory/controller');
const { getLastChunksIdsChroma } = require('../chroma/controller');
const multer  = require('multer');
const axios = require('axios');

module.exports = {
	index: async (req, res) => {
		try {
			const information = await Information.findAll({
                include: {
                    model: CategoryInformation,
                    attributes: ['name_category_information', 'description_category_information'],
                }
            });

			res.status(200).json({ data: information });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getInformationById: async (req, res) => {
		try {
			const { id } = req.params;
			const information = await Information.findOne({ 
                where: { id: id },
                include: {
                    model: CategoryInformation,
                    attributes: ['name_category_information', 'description_category_information'], 
                }
            });
			logHistoryCreated(req.user.id, null, Information.getTableName().tableName, "GET DATA", JSON.stringify(information, null, 4) + " --> " + req.user.email, "Information.findOne({ where: { id: id } })");
			res.status(200).json({ data: information });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Information.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { category_information_id, title_information, description_information, file_path_information} = req.body;

			var status_information = 1;

			const newInformation = await Information.create({
				category_information_id, title_information, description_information, file_path_information, status_information
			});
			res.status(200).json({ data: newInformation, status: "Information berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreatedUploadFile: async (req, res, next) => {
		try {
            const { category_information_id, title_information, description_information } = req.body;

            const last_chunks_ids = await getLastChunksIdsChroma();
            // console.log(last_chunks_ids);

            if (req.file) {
                let temporary_path = req.file.path;
                let original_extension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + original_extension;
                let target_path = path.resolve(config.rootPath, `public/uploads/document_information/${filename}`);
                const base_url = `${req.protocol}://${req.get('host')}`;
                let file_path_information = base_url + "/uploads/document_information/" + filename;

                var status_information = 1;

                const src = fs.createReadStream(temporary_path);
                const destination = fs.createWriteStream(target_path);

                src.pipe(destination)
                src.on('end', async () => {
                    try {
                        const newInformation = await Information.create({
                            category_information_id, title_information, description_information, file_path_information, status_information
                        });
                        const id_information_send = "id_information=" + newInformation.id;
                        const file_path_send = "&file_path=" + file_path_information;
                        const last_chunks_ids_send  = "&last_chunks_ids=" + last_chunks_ids;

                        await axios.post(process.env.BASE_URL_PYTHON + ':' + process.env.PORT_PYTHON + '/add_document/?' + id_information_send + file_path_send + last_chunks_ids_send)
                        .then(function (response) {
                            console.log("response");
                            console.log(response.status);
                            console.log(response.statusText);
                            console.log(response.data);
                        })
                        .catch(function (error) {
                            console.log("error");
                            console.log(error);
                        });

                        res.status(200).json({ data: newInformation,  last_chunks_ids: last_chunks_ids})
                    } catch (err) {
                        if (err && err.name === 'SequelizeValidationError') {
                            return res.status(422).json({ error: 1, message: err.message, fields: err.errors })
                        }
                        next(err);
                    }
                });
            } else {
                res.status(500).json({ message: 'Document is required!' })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const information = await Information.findOne({ where: { id: id } });
			if (information) {

                const path_old = information.file_path_information;

                // Split the string by "/" and get the last element
                const parts = path_old.split('/');
                const filename_old = parts[parts.length - 1];
                
                let old_document = `${config.rootPath}/public/uploads/document_information/${filename_old}`;
                if (fs.existsSync(old_document)) {
                    fs.unlinkSync(old_document)
                }

                const id_information_send = "id_information=" + information.id;
                const chunk_ids_min_send = "&chunk_ids_min=" + information.chunk_ids_min;
                const chunk_ids_max_send  = "&chunk_ids_max=" + information.chunk_ids_max;

                await axios.post('http://127.0.0.1:8004/delete_document_by_ids/?' + id_information_send + chunk_ids_min_send + chunk_ids_max_send)
                .then(function (response) {
                    console.log("response");
                    console.log(response);
                })
                .catch(function (error) {
                    console.log("error");
                    console.log(error);
                });

				await Information.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Information",
				});
			} else {
				res.status(200).json({
					message: "Data category information tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { category_information_id ="", title_information ="", description_information ="", file_path_information =""} = req.body;
            const payload = {};

            // Memastikan bahwa information dengan ID tersebut ada
            let information = await Information.findOne({ where: { id: id } });

            if (!information) {
                return res.status(404).json({
                    error: 1,
                    message: "Information not found",
                });
            }

            if (information.category_information_id != category_information_id) {
            	if (category_information_id.length) payload.category_information_id = category_information_id;
            }

            if (information.title_information != title_information) {
            	if (title_information.length) payload.title_information = title_information;
            }

            if (information.description_information != description_information) {
            	if (description_information.length) payload.description_information = description_information;
            }

            if (information.file_path_information != file_path_information) {
            	if (file_path_information.length) payload.file_path_information = file_path_information;
            }

            // Mengupdate data information
            await Information.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            category_information_id: payload.category_information_id || information.category_information_id,
                            title_information: payload.title_information || information.title_information,
                            description_information: payload.description_information || information.description_information,
                            file_path_information: payload.file_path_information || information.file_path_information,
                        },
						message: "Update Information Successfully"
                    });
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(422).json({
                        error: 1,
                        message: err.message,
                        fields: err.errors
                    });
                });

        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({
                error: 1,
                message: 'Internal server error',
            });
        }
    },
    actionEditChroma: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { chunk_total ="", chunk_ids_min ="", chunk_ids_max ="",} = req.body;
            const payload = {};

            console.log(req.params);
            console.log(req.body);
            // Memastikan bahwa information dengan ID tersebut ada
            let information = await Information.findOne({ where: { id: id } });

            if (!information) {
                return res.status(404).json({
                    error: 1,
                    message: "Information not found",
                });
            }

            payload.chunk_total = chunk_total;
            payload.chunk_ids_min = chunk_ids_min;
            payload.chunk_ids_max = chunk_ids_max;

            console.log("payload");
            console.log(payload);

            // Mengupdate data information
            await Information.update(payload, { where: { id: id } })
                .then(async(updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    const id_chroma = 1;
                    const last_chunks_ids = chunk_ids_max;
                    
                    await Chroma.update({last_chunks_ids:last_chunks_ids}, { where: { id: id_chroma } })
                        .then((updatedRows) => {
                            console.log(`${updatedRows} rows updated successfully.`);
                        })
                        .catch((err) => {
                            console.error('Error:', err);
                            res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            });
                        });

                    res.status(200).json({
                        data: {
                            id: id,
                            chunk_total: payload.chunk_total || information.chunk_total,
                            chunk_ids_min: payload.chunk_ids_min || information.chunk_ids_min,
                            chunk_ids_max: payload.chunk_ids_max || information.chunk_ids_max
                        },
                        message: "Update Information Successfully"
                    });
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(422).json({
                        error: 1,
                        message: err.message,
                        fields: err.errors
                    });
                });


            

        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({
                error: 1,
                message: 'Internal server error',
            });
        }
    },
    actionDeleteChroma: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { chunk_total ="", chunk_ids_min ="", chunk_ids_max ="",} = req.body;
            const payload = {};

            console.log(req.params);
            console.log(req.body);
            // Memastikan bahwa information dengan ID tersebut ada
            let information = await Information.findOne({ where: { id: id } });

            if (!information) {
                return res.status(404).json({
                    error: 1,
                    message: "Information not found",
                });
            }

            payload.chunk_total = chunk_total;
            payload.chunk_ids_min = chunk_ids_min;
            payload.chunk_ids_max = chunk_ids_max;

            console.log("payload");
            console.log(payload);

            // Mengupdate data information
            await Information.update(payload, { where: { id: id } })
                .then(async(updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    const id_chroma = 1;
                    const last_chunks_ids = chunk_ids_max;

                    res.status(200).json({
                        data: {
                            id: id,
                            chunk_total: payload.chunk_total || information.chunk_total,
                            chunk_ids_min: payload.chunk_ids_min || information.chunk_ids_min,
                            chunk_ids_max: payload.chunk_ids_max || information.chunk_ids_max
                        },
                        message: "Update Information Successfully"
                    });
                })
                .catch((err) => {
                    console.error('Error:', err);
                    res.status(422).json({
                        error: 1,
                        message: err.message,
                        fields: err.errors
                    });
                });


            

        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({
                error: 1,
                message: 'Internal server error',
            });
        }
    },
    actionEditUploadFile: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { category_information_id ="", title_information ="", description_information ="" } = req.body;

            const payload = {};

            // Memastikan bahwa information dengan ID tersebut ada
            let information = await Information.findOne({ where: { id: id } });

            if (!information) {
                return res.status(404).json({ error: 1, message: "Information not found", });
            }

            if (information.category_information_id != category_information_id) {
                if (category_information_id.length) payload.category_information_id = category_information_id;
            }

            if (information.title_information != title_information) {
                if (title_information.length) payload.title_information = title_information;
            }

            if (information.description_information != description_information) {
                if (description_information.length) payload.description_information = description_information;
            }

            if (req.file) {
                const id_information_send = "id_information=" + information.id;
                const chunk_ids_min_send = "&chunk_ids_min=" + information.chunk_ids_min;
                const chunk_ids_max_send  = "&chunk_ids_max=" + information.chunk_ids_max;

                await axios.post('http://127.0.0.1:8004/delete_document_by_ids/?' + id_information_send + chunk_ids_min_send + chunk_ids_max_send)
                .then(function (response) {
                    console.log("response");
                    console.log(response);
                })
                .catch(function (error) {
                    console.log("error");
                    console.log(error);
                });

                let temporary_path = req.file.path;
                let original_extension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + original_extension;
                let target_path = path.resolve(config.rootPath, `public/uploads/document_information/${filename}`);
                const base_url = `${req.protocol}://${req.get('host')}`;
                let file_path_information = base_url + "/uploads/document_information/" + filename;

                if (information.file_path_information != file_path_information) {
                    if (file_path_information.length) payload.file_path_information = file_path_information;
                }

                const path_old = information.file_path_information;

                // Split the string by "/" and get the last element
                const parts = path_old.split('/');
                const filename_old = parts[parts.length - 1];

                let old_document = `${config.rootPath}/public/uploads/document_information/${filename_old}`;
                if (fs.existsSync(old_document)) {
                    fs.unlinkSync(old_document)
                }


                const src = fs.createReadStream(temporary_path);
                const destination = fs.createWriteStream(target_path);

                src.pipe(destination)
                src.on('end', async () => {
                    try {
                        // Mengupdate data information
                        await Information.update(payload, { where: { id: id } })
                            .then(async (updatedRows) => {
                               
                                const last_chunks_ids = await getLastChunksIdsChroma();
                                const id_information_send = "id_information=" + information.id;
                                const file_path_send = "&file_path=" + payload.file_path_information;
                                const last_chunks_ids_send  = "&last_chunks_ids=" + last_chunks_ids;

                                await axios.post('http://127.0.0.1:8004/add_document/?' + id_information_send + file_path_send + last_chunks_ids_send)
                                .then(function (response) {
                                    console.log("response");
                                    console.log(response.data);
                                })
                                .catch(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });

                                console.log(`${updatedRows} rows updated successfully.`);
                                res.status(200).json({
                                    data: {
                                        id: id,
                                        category_information_id: payload.category_information_id || information.category_information_id,
                                        title_information: payload.title_information || information.title_information,
                                        description_information: payload.description_information || information.description_information,
                                        file_path_information: payload.file_path_information || information.file_path_information,
                                    },
                                    message: "Update Information Successfully"
                                });
                            })
                            .catch((err) => {
                                console.error('Error:', err);
                                res.status(422).json({
                                    error: 1,
                                    message: err.message,
                                    fields: err.errors
                                });
                            });
                    } catch (err) {
                        if (err && err.name === 'SequelizeValidationError') {
                            return res.status(422).json({ error: 1, message: err.message, fields: err.errors })
                        }
                        next(err);
                    }
                });
            } else {
                // res.status(500).json({ message: 'Document is required!' })
                // Mengupdate data information
                await Information.update(payload, { where: { id: id } })
                    .then((updatedRows) => {
                        console.log(`${updatedRows} rows updated successfully.`);
                        res.status(200).json({
                            data: {
                                id: id,
                                category_information_id: payload.category_information_id || information.category_information_id,
                                title_information: payload.title_information || information.title_information,
                                description_information: payload.description_information || information.description_information,
                                file_path_information: payload.file_path_information || information.file_path_information,
                            },
                            message: "Update Information Successfully"
                        });
                    })
                    .catch((err) => {
                        console.error('Error:', err);
                        res.status(422).json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    });
            }
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
    },
    actionActivateInformation: async (req, res) => {
		try {
			const { id } = req.params;

			const information = await Information.findOne({ where: { id: id } });
			if (information) {
				await Information.update({ status_information: 1 }, { where: { id: id } })
                
                const last_chunks_ids = await getLastChunksIdsChroma();
                const id_information_send = "id_information=" + information.id;
                const file_path_send = "&file_path=" + information.file_path_information;
                const last_chunks_ids_send  = "&last_chunks_ids=" + last_chunks_ids;

                await axios.post('http://127.0.0.1:8004/add_document/?' + id_information_send + file_path_send + last_chunks_ids_send)
                .then(function (response) {
                    console.log("response");
                    console.log(response);
                })
                .catch(function (error) {
                    console.log("error");
                    console.log(error);
                });

				res.status(200).json({
					message: "Berhasil Aktivasi Information",
				});
			} else {
				res.status(200).json({
					message: "Data Information tidak ditemukan",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDeactivateInformation: async (req, res) => {
		try {
			const { id } = req.params;

			const information = await Information.findOne({ where: { id: id } });
			if (information) {
				await Information.update({ status_information: 0 }, { where: { id: id } })

                const id_information_send = "id_information=" + information.id;
                const chunk_ids_min_send = "&chunk_ids_min=" + information.chunk_ids_min;
                const chunk_ids_max_send  = "&chunk_ids_max=" + information.chunk_ids_max;

                await axios.post('http://127.0.0.1:8004/delete_document_by_ids/?' + id_information_send + chunk_ids_min_send + chunk_ids_max_send)
                .then(function (response) {
                    console.log("response");
                    console.log(response);
                })
                .catch(function (error) {
                    console.log("error");
                    console.log(error);
                });

				res.status(200).json({
					message: "Berhasil Deaktivasi Information",
				});
			} else {
				res.status(200).json({
					message: "Data Information tidak ditemukan",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
};
