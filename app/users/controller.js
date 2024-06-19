const User = require("./model");
const Role = require("../role/model");
const { logHistoryCreated } = require('../logHistory/controller');
const bcrypt = require("bcryptjs");
const config = require('../../config');
const jwt = require('jsonwebtoken');

module.exports = {
	index: async (req, res) => {
		// logHistoryCreated(1, null, "user", "test", "test2", "test3");

		try {
			// const user = await User.findAll();
			const user = await User.findAll({
				include: {
					model: Role,
					attributes: ['name_role'], // Hanya ambil atribut name_role dari tabel Role
				}
			});

			// LOGGING
			logHistoryCreated(req.user.id, null, User.getTableName().tableName, "GET DATA", JSON.stringify(user.map(user => user.dataValues), null, 4) + " --> " + req.user.email, "User.findAll()");

			res.status(200).json({ data: user });
		} catch (err) {
			// LOGGING
			logHistoryCreated(req.user.id, null, User.getTableName().tableName, "ERROR", "-", err.message || "internal server error");

			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getUserById: async (req, res) => {
		try {
			const { id } = req.params;
			const user = await User.findOne({ 
				where: { id: id }, 
				include: {
					model: Role,
					attributes: ['name_role'], // Hanya ambil atribut name_role dari tabel Role
				}
			});
			res.status(200).json({ data: user });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	getUserByEmail: async (req, res) => {
		try {
			const { email } = req.body;
			const user = await User.findOne({ 
				where: { email: email },
				include: {
					model: Role,
					attributes: ['name_role'], // Hanya ambil atribut name_role dari tabel Role
				} 
		});
			res.status(200).json({ data: user });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	add_operator: async (req, res) => {
		try {
			const { name, email, } = req.body;

			// Default role_id
			role_id = 2;

			// Default password
			password = "1234567890";

			// Default status
			status = 1;

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
    },
    actionChangePassword: async (req, res, next) => {
        const { id } = req.params;
        try {
            const { password_old, password_new, password_new_confirmation} = req.body;

            // if (password_old.length) payload.password_old = password_old;

            // Memastikan bahwa user dengan ID tersebut ada
            let user = await User.findOne({ where: { id: id } });

            if (!user) {
                return res.status(404).json({
                    error: 1,
                    message: "User not found",
                });
            }

            // cek apakah password_old sama dengan password account ini?
            const checkpassword = bcrypt.compareSync(password_old, user.password);
            if (checkpassword) {
            	if (password_new == password_new_confirmation) {
            		const hashedPassword = await bcrypt.hash(password_new, 10);

		            // Mengupdate data user
		            await User.update({ password: hashedPassword }, { where: { id: id } })
		                .then((updatedRows) => {
		                    console.log(`${updatedRows} rows updated successfully.`);
		                    res.status(200).json({
								message: "Update Password User Successfully"
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
            	else{
            		res.status(200).json({
						message: "Password new berbeda dengan password confirmation",
					});
            	}
            }
            else {
            	res.status(200).json({
					message: "Password old berbeda dengan password pada account",
				});
            }



        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({
                error: 1,
                message: 'Internal server error',
            });
        }
    },
    passwordGenerator: async (req, res) => {
		try {
			const { password } = req.body;
			const payload = {};

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			payload.password = password;
			payload.hashedPassword = hashedPassword

			res.status(200).json({ data: payload });
		} catch (err) {
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	jwtDecoder: async (req, res, next) => {
        try {
            const { token } = req.body;
           
            const data = await jwt.verify(token, config.jwtKey);

            res.status(200).json({ data: data });

        } catch (err) { 
            res.status(500).json({ message: err.message || "internal server error" });
        }
    }
	
};
