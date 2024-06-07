const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
	users: async (req, res) => {
		try {
			const user = await User.findAll();
			res.status(200).json({ data: user });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	add_operator: async (req, res) => {
		try {
			const { role_id, name, email, password, status } = req.body;

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = await User.create({
				role_id,
				name,
				email,
				password: hashedPassword,
				status,
			});
			res.status(200).json({ data: newUser, status: "User berhasil dibuat" });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDelete: async (req, res) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ where: { id: id } });
			if (user.role_id != 1) {
				await User.destroy({ where: { id: id } });

				res.status(200).json({
					message: "Berhasil Hapus User",
				});
			} else {
				res.status(200).json({
					message: "Superadmin Cannot Delete",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionActivateAccountOperator: async (req, res) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ where: { id: id } });
			if (user.role_id != 1) {
				await User.update({ status: 1 }, { where: { id: id } })

				res.status(200).json({
					message: "Berhasil Aktivasi User",
				});
			} else {
				res.status(200).json({
					message: "Superadmin Cannot Updated via app",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDeactivateAccountOperator: async (req, res) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ where: { id: id } });
			if (user.role_id != 1) {
				await User.update({ status: 0 }, { where: { id: id } })

				res.status(200).json({
					message: "Berhasil Deaktivasi User",
				});
			} else {
				res.status(200).json({
					message: "Superadmin Cannot Updated via app",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionActivateEmailOperator: async (req, res) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ where: { id: id } });
			if (user.role_id != 1) {
				await User.update({ verify_email: 1 }, { where: { id: id } })

				res.status(200).json({
					message: "Berhasil Aktivasi Email User",
				});
			} else {
				res.status(200).json({
					message: "Superadmin Cannot Updated via app",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionDeactivateEmailOperator: async (req, res) => {
		try {
			const { id } = req.params;

			const user = await User.findOne({ where: { id: id } });
			if (user.role_id != 1) {
				await User.update({ verify_email: 0 }, { where: { id: id } })

				res.status(200).json({
					message: "Berhasil Deaktivasi Email User",
				});
			} else {
				res.status(200).json({
					message: "Superadmin Cannot Updated via app",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	actionEdit: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { name = "", email = "" } = req.body;
            const payload = {};
            if (name.length) payload.name = name;
            
            status = 0;
            verify_email = 0;

            // Memastikan bahwa user dengan ID tersebut ada
            let user = await User.findOne({ where: { id: id } });
            
            // cek apakah email yg di inputkan sama atau tidak dengan email sebelumnya, jika tidak sama maka indikasi email di update
            if (user.email != req.body.email) {
            	if (email.length) payload.email = email;
            	payload.status = status;
            	payload.verify_email = verify_email;
            }

            if (!user) {
                return res.status(404).json({
                    error: 1,
                    message: "User not found",
                });
            }

            // Mengupdate data user
            await User.update(payload, { where: { id: id } })
                .then((updatedRows) => {
                    console.log(`${updatedRows} rows updated successfully.`);
                    res.status(200).json({
                        data: {
                            id: id,
                            name: payload.name || user.name,  // Tampilkan nama yang baru atau lama jika tidak diupdate
                            email: payload.email || user.email // Tampilkan email yang baru atau lama jika tidak diupdate
                        },
						message: "Update User Successfully"
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
    }
	
};
