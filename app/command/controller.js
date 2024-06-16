const Command = require("./model");
const { logHistoryCreated } = require('../logHistory/controller');

module.exports = {
	index: async (req, res) => {
		try {
			const command = await Command.findAll();
			res.status(200).json({ data: command });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		console.log("=================");
		console.log(req.user);
		console.log(req.body);
		console.log("=================");
		try {
			const { name_command,  response_command} = req.body;

			var status_command = 1;

			const newCommand = await Command.create({
				name_command, response_command, status_command
			});
			res.status(200).json({ data: newCommand, status: "Command berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const command = await Command.findOne({ where: { id: id } });
			if (command) {
				await Command.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Command",
				});
			} else {
				res.status(200).json({
					message: "Data Command tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { name_command = "", response_command = ""} = req.body;
            const payload = {};

            // Memastikan bahwa command dengan ID tersebut ada
            let command = await Command.findOne({ where: { id: id } });

            if (!command) {
                return res.status(404).json({
                    error: 1,
                    message: "Command not found",
                });
            }

            if (command.name_command != name_command) {
            	if (name_command.length) payload.name_command = name_command;
            }

            if (command.response_command != response_command) {
            	if (response_command.length) payload.response_command = response_command;
            }

            // Mengupdate data command
            await Command.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            name_command: payload.name_command || command.name_command,
                            response_command: payload.response_command || command.response_command,
                        },
						message: "Update Command Successfully"
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
    actionActivateCommand: async (req, res) => {
		try {
			const { id } = req.params;

			const command = await Command.findOne({ where: { id: id } });
			if (command) {
				await Command.update({ status_command: 1 }, { where: { id: id } })

				res.status(200).json({
					message: "Berhasil Aktivasi Command",
				});
			} else {
				res.status(200).json({
					message: "Data Command tidak ditemukan",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDeactivateCommand: async (req, res) => {
		try {
			const { id } = req.params;

			const command = await Command.findOne({ where: { id: id } });
			if (command) {
				await Command.update({ status_command: 0 }, { where: { id: id } })

				res.status(200).json({
					message: "Berhasil Deaktivasi Command",
				});
			} else {
				res.status(200).json({
					message: "Data Command tidak ditemukan",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
};
