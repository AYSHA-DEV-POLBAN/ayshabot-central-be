const Role = require("./model");
const { logHistoryCreated } = require('../logHistory/controller');

module.exports = {
	index: async (req, res) => {
		try {
			const role = await Role.findAll();
			res.status(200).json({ data: role });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getRoleById: async (req, res) => {
		try {
			const { id } = req.params;
			const role = await Role.findOne({ where: { id: id } });
			logHistoryCreated(req.user.id, null, Role.getTableName().tableName, "GET DATA", JSON.stringify(role, null, 4) + " --> " + req.user.email, "Role.findOne({ where: { id: id } })");
			res.status(200).json({ data: role });
		} catch (err) {
			logHistoryCreated(req.user.id, null, Role.getTableName().tableName, "ERROR", "-", err.message || "internal server error");
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionCreated: async (req, res) => {
		try {
			const { name_role } = req.body;

			const newRole = await Role.create({
				name_role
			});
			res.status(200).json({ data: newRole, status: "Role berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const role = await Role.findOne({ where: { id: id } });
			if (role) {
				await Role.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus Role",
				});
			} else {
				res.status(200).json({
					message: "Data role tidak ada",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { name_role = ""} = req.body;
            const payload = {};
            if (name_role.length) payload.name_role = name_role;
            console.log(name_role.length);
            console.log(payload);

            // Memastikan bahwa role dengan ID tersebut ada
            let role = await Role.findOne({ where: { id: id } });

            if (!role) {
                return res.status(404).json({
                    error: 1,
                    message: "Role not found",
                });
            }

            // Mengupdate data role
            await Role.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            name_role: payload.name_role || role.name_role
                        },
						message: "Update Role Successfully"
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
