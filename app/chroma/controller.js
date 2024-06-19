const Chroma = require("./model");
const { logHistoryCreated } = require('../logHistory/controller');
const { Op } = require('sequelize'); //digunakan untuk operator kueri.
const moment = require('moment'); // Pastikan menginstal moment untuk memudahkan manipulasi tanggal

module.exports = {
	index: async (req, res) => {
		try {
			const chroma = await Chroma.findAll();
			res.status(200).json({ data: chroma });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getChromaById: async (req, res) => {
		try {
			const { id } = req.params;
			const chroma = await Chroma.findOne({ where: { id: id } });
			logHistoryCreated(req.user.id, null, Chroma.getTableName().tableName, "GET DATA", JSON.stringify(chroma, null, 4) + " --> " + req.user.email, "Chroma.findOne({ where: { id: id } })");
			res.status(200).json({ data: chroma });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Chroma.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getLastChunksIdsChroma: async () => {
		try {
			const chroma = await Chroma.findOne({ where: { id: 1 } });
			// console.log(chroma.last_chunks_ids);
			return chroma.last_chunks_ids;

		} catch (err) {
			console.log(err.message || "internal server error");
		}
	},
	actionReset: async (req, res) => {
        try {
        	payload = {};
        	payload.id = 1;
        	payload.last_chunks_ids = 0;
            // Mereset data chroma
            await Chroma.update(payload, { where: { id: payload.id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: payload,
						message: "Reset Chroma Successfully"
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
	actionCreated: async (req, res) => {
		try {
			const { last_chunks_ids } = req.body;

			const newChroma = await Chroma.create({
				last_chunks_ids
			});
			res.status(200).json({ data: newChroma, status: "Chroma berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { last_chunks_ids = ""} = req.body;
            const payload = {};
            // if (last_chunks_ids.length) payload.last_chunks_ids = last_chunks_ids;


            // Memastikan bahwa chroma dengan ID tersebut ada
            let chroma = await Chroma.findOne({ where: { id: id } });

            if (chroma.last_chunks_ids != last_chunks_ids) {
            	if (last_chunks_ids.length) payload.last_chunks_ids = last_chunks_ids;
            }

            if (!chroma) {
                return res.status(404).json({
                    error: 1,
                    message: "Chroma not found",
                });
            }

            // Mengupdate data chroma
            await Chroma.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            last_chunks_ids: payload.last_chunks_ids || chroma.last_chunks_ids
                        },
						message: "Update Chroma Successfully"
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
};
