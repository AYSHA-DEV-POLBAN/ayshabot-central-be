const Command = require("./model");
const { logHistoryCreated } = require('../logHistory/controller');

module.exports = {
	index: async (req, res) => {
		try {
			const command = await Command.findAll();
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "GET DATA", JSON.stringify(command.map(command => command.dataValues), null, 4) + " --> " + req.user.email, "Command.findAll()");
			res.status(200).json({ data: command });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getCommandById: async (req, res) => {
		try {
			const { id } = req.params;
			const command = await Command.findOne({ where: { id: id } });
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "GET DATA", JSON.stringify(command, null, 4) + " --> " + req.user.email, "Command.findOne({ where: { id: id } })");
			res.status(200).json({ data: command });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCheckResponseCommand: async (req, res) => {
		try {
			const { name_command } = req.body;

			const command = await Command.findOne({ where: { name_command : name_command, status_command : 1 } });

			if (command) {
				logHistoryCreated(null, null, Command.getTableName().tableName, "GET DATA", JSON.stringify(command, null, 4) + " --> " + null, "Command.findOne({ where: { name_command : name_command, status_command : 1 } })");
				res.status(200).json({ data: command, status: "Command bisa dipakai" });
			}
			else {
				logHistoryCreated(null, null, Command.getTableName().tableName, "ERROR", "-", "Data Command tidak ada / Command sedang dalam status deactive");
				res.status(500).json({ message : "Data Command tidak ada / Command sedang dalam status deactive" });
			}

		} catch (err) {
			logHistoryCreated(null, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCheckCommand: async (name_command) => {
		try {
			const command = await Command.findOne({ where: { name_command : name_command, status_command : 1 } });

			if (command) {
				return command.response_command;
				// logHistoryCreated(null, null, Command.getTableName().tableName, "GET DATA", JSON.stringify(command, null, 4) + " --> " + null, "Command.findOne({ where: { name_command : name_command, status_command : 1 } })");
				// res.status(200).json({ data: command, status: "Command bisa dipakai" });
			}
			else {
				return null;
				// logHistoryCreated(null, null, Command.getTableName().tableName, "ERROR", "-", "Data Command tidak ada / Command sedang dalam status deactive");
				// res.status(500).json({ message : "Data Command tidak ada / Command sedang dalam status deactive" });
			}

		} catch (err) {
			logHistoryCreated(null, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { name_command,  response_command} = req.body;

			var status_command = 1;

			const newCommand = await Command.create({
				name_command, response_command, status_command
			});
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "CREATE DATA", JSON.stringify(newCommand, null, 4) + " --> " + req.user.email, "Command.create({ name_command, description_command });");
			res.status(200).json({ data: newCommand, status: "Command berhasil dibuat" });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const command = await Command.findOne({ where: { id: id } });
			if (command) {
				await Command.destroy({ where: { id: id } });

				logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "DELETE DATA", JSON.stringify(req.params, null, 4) + " --> " + req.user.email, "Command.destroy({ where: { id: id } })");
				res.status(200).json({ message: "Berhasil Hapus Command", });
			} else {
				logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", "Data Command tidak ada");
				res.status(200).json({ message: "Data Command tidak ada", });
			}
		} catch (err) {
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
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
                return res.status(404).json({ error: 1, message: "Command not found", });
            }

            if (command.name_command != name_command) {
            	if (name_command.length) payload.name_command = name_command;
            }

            if (command.response_command != response_command) {
            	if (response_command.length) payload.response_command = response_command;
            }

            data = {};
            data.id = id;
            data.name_command = payload.name_command || command.name_command;
            data.response_command = payload.response_command || command.response_command;


            // Mengupdate data command
            await Command.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                	logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "UPDATE DATA", JSON.stringify(data, null, 4) + " --> " + req.user.email, "Command.update(payload, { where: { id: id } })");
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({ data: data, message: "Update Command Successfully" });
                })
                .catch((err) => {
                    console.error('Error:', err);
                    logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
                    res.status(422).json({ error: 1, message: err.message, fields: err.errors });
                });

        } catch (err) {
            console.error('Error:', err);
            logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
            res.status(500).json({ error: 1, message: 'Internal server error', });
        }
    },
    actionActivateCommand: async (req, res) => {
		try {
			const { id } = req.params;

			const command = await Command.findOne({ where: { id: id } });
			if (command) {
				await Command.update({ status_command: 1 }, { where: { id: id } })

				// logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "UPDATE DATA", JSON.stringify(command, null, 4) + " --> " + req.user.email, "Command.findOne({ where: { id: id } })");

				res.status(200).json({ message: "Berhasil Aktivasi Command", });
			} else {
				logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", "Data Command tidak ditemukan");
				res.status(200).json({ message: "Data Command tidak ditemukan", });
			}
		} catch (err) {
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDeactivateCommand: async (req, res) => {
		try {
			const { id } = req.params;

			const command = await Command.findOne({ where: { id: id } });
			if (command) {
				await Command.update({ status_command: 0 }, { where: { id: id } })

				// logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "GET DATA", JSON.stringify(command, null, 4) + " --> " + req.user.email, "Command.findOne({ where: { id: id } })");

				res.status(200).json({ message: "Berhasil Deaktivasi Command", });
			} else {
				logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", "Data Command tidak ditemukan");
				res.status(200).json({ message: "Data Command tidak ditemukan", });
			}
		} catch (err) {
			logHistoryCreated(req.user.id, null, Command.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
};
