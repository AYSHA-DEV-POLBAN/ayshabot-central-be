const WhatsappDevice = require("./model");
const { logHistoryCreated } = require('../logHistory/controller');
const multer  = require('multer');
const path = require('path')
const fs = require('fs')
const config = require('../../config')

module.exports = {
	index: async (req, res) => {
		try {
			const whatsapp_device = await WhatsappDevice.findAll();
			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "GET DATA", JSON.stringify(whatsapp_device.map(whatsapp_device => whatsapp_device.dataValues), null, 4) + " --> " + req.user.email, "WhatsappDevice.findAll()");
			res.status(200).json({ data: whatsapp_device });
		} catch (err) {
			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getWhatsappDeviceById: async (req, res) => {
		try {
			const { id } = req.params;
			const whatsapp_device = await WhatsappDevice.findOne({ where: { id: id } });
			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "GET DATA", JSON.stringify(whatsapp_device, null, 4) + " --> " + req.user.email, "WhatsappDevice.findOne({ where: { id: id } })");
			res.status(200).json({ data: whatsapp_device });
		} catch (err) {
			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { session_device } = req.body;

			var status_device = 1;

			const newWhatsappDevice = await WhatsappDevice.create({
				session_device, status_device
			});

			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "CREATE DATA", JSON.stringify(newWhatsappDevice, null, 4) + " --> " + req.user.email, "WhatsappDevice.create({ session_device, status_device });");
			res.status(200).json({ data: newWhatsappDevice, status: "Category Information berhasil dibuat" });
		} catch (err) {
			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreatedUploadFile: async (req, res, next) => {
		try {
            if (req.file) {
            	console.log(req.file);
                let temporary_path = req.file.path;
                let original_extension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = 'qr_code_image' + '.' + original_extension;
                let target_path = path.resolve(config.rootPath, `public/uploads/qr_wa/${filename}`);
                const base_url = `${req.protocol}://${req.get('host')}`;
                let file_path_qr = base_url + "/uploads/qr_wa/" + filename;

                
                let old_document = target_path;
                if (fs.existsSync(old_document)) {
                    fs.unlinkSync(old_document)
                }

                const src = fs.createReadStream(temporary_path);
                const destination = fs.createWriteStream(target_path);

                src.pipe(destination)
                src.on('end', async () => {
                    try {
                        res.status(200).json({ filename: filename, file_path_qr: file_path_qr })
                    } catch (err) {
                        if (err && err.name === 'SequelizeValidationError') {
                            return res.status(422).json({ error: 1, message: err.message, fields: err.errors })
                        }
                        next(err);
                    }
                });
            } else {
                res.status(500).json({ message: 'No QR Uploaded' })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || 'internal server error' })
        }
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const whatsapp_device = await WhatsappDevice.findOne({ where: { id: id } });
			if (whatsapp_device) {
				await WhatsappDevice.destroy({ where: { id: id } });

				logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "DELETE DATA", JSON.stringify(req.params, null, 4) + " --> " + req.user.email, "WhatsappDevice.create({ session_device, status_device });");

				res.status(200).json({ message: "Berhasil Hapus Category Information", });
			} else {
				logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", "Data category information tidak ada");
				res.status(200).json({ message: "Data category information tidak ada", });
			}
		} catch (err) {
			logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { session_device = "", status_device = ""} = req.body;
            const payload = {};


            // Memastikan bahwa whatsapp_device dengan ID tersebut ada
            let whatsapp_device = await WhatsappDevice.findOne({ where: { id: id } });

            if (!whatsapp_device) {
            	logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", "WhatsappDevice not found");
                return res.status(404).json({
                    error: 1,
                    message: "WhatsappDevice not found",
                });
            }

            if (whatsapp_device.session_device != session_device) {
            	if (session_device.length) payload.session_device = session_device;
            }

            if (whatsapp_device.status_device != status_device) {
            	if (status_device.length) payload.status_device = status_device;
            }

            data = {};
            data.id = id;
            data.session_device = payload.session_device || whatsapp_device.session_device;
            data.status_device = payload.status_device || whatsapp_device.status_device;


            // Mengupdate data whatsapp_device
            await WhatsappDevice.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "GET DATA", JSON.stringify(data, null, 4) + " --> " + req.user.email, "WhatsappDevice.update(payload, { where: { id: id } })");
                    res.status(200).json({
                        data: data,
						message: "Update Category Information Successfully"
                    });
                })
                .catch((err) => {
                	logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
                    console.error('Error:', err);
                    res.status(422).json({ error: 1, message: err.message, fields: err.errors });
                });

        } catch (err) {
            console.error('Error:', err);
            logHistoryCreated(req.user.id, null, WhatsappDevice.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
            res.status(500).json({ error: 1, message: 'Internal server error', });
        }
    },
};
