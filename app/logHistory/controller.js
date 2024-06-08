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
