const LogHistory = require("./model");

module.exports = {
	index: async (req, res) => {
		try {
			const log_history = await LogHistory.findAll();
			res.status(200).json({ data: log_history });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	logHistoryCreated: async (user_id, client_id, table_name, action_name, action_data, log_description) => {
		try {
			// const { user_id, client_id, table_name, action_name, action_data, log_description} = req.body;

			const newLogHistory = await LogHistory.create({
				user_id, client_id, table_name, action_name, action_data, log_description
			});

			console.log("============= LOG HISTORY =============");
			console.log("code : 200");
			console.log("status : Log History berhasil dibuat");
			console.log("=======================================");
			// res.status(200).json({ data: newLogHistory, status: "Log History berhasil dibuat" });
		} catch (err) {
			console.log("============= LOG HISTORY =============");
			console.log(err.message || "internal server error");
			console.log("=======================================");
			// res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getLogHistoryById: async (req, res) => {
		try {
			const { id } = req.params;
			const log_history = await LogHistory.findOne({ where: { id: id } });

			const payload = {};

			payload.user_id = req.user.id;
			payload.client_id = null;
			payload.table_name = LogHistory.getTableName().tableName;
			payload.action_name = "GET DATA";
			payload.action_data = JSON.stringify(log_history, null, 4) + " --> " + req.user.email;
			payload.log_description = "LogHistory.findOne({ where: { id: id } })";

			console.log(payload);
			const logging = await LogHistory.create(payload);
			res.status(200).json({ data: log_history });
		} catch (err) {
			const payload = {};

			payload.user_id = req.user.id;
			payload.client_id = null;
			payload.table_name = LogHistory.getTableName().tableName;
			payload.action_name = "ERROR";
			payload.action_data = "-";
			payload.log_description = err.message || "internal server error";

			console.log(payload);
			const logging = await LogHistory.create(payload);
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { user_id, client_id, table_name, action_name, action_data, log_description} = req.body;

			const newLogHistory = await LogHistory.create({
				user_id, client_id, table_name, action_name, action_data, log_description
			});
			res.status(200).json({ data: newLogHistory, status: "Log History berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const log_history = await LogHistory.findOne({ where: { id: id } });
			if (log_history) {
				await LogHistory.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Log History",
				});
			} else {
				res.status(200).json({
					message: "Data category Log History tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
};
