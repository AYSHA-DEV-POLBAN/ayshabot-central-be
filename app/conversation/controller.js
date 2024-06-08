const Conversation = require("./model");

module.exports = {
	index: async (req, res) => {
		try {
			const conversation = await Conversation.findAll();
			res.status(200).json({ data: conversation });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { client_id, question_client,  response_system, chunk_relevant, bill} = req.body;

			const newConversation = await Conversation.create({
				client_id, question_client, response_system, chunk_relevant, bill
			});
			res.status(200).json({ data: newConversation, status: "Conversation berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const conversation = await Conversation.findOne({ where: { id: id } });
			if (conversation) {
				await Conversation.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Conversation",
				});
			} else {
				res.status(200).json({
					message: "Data Conversation tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
};
