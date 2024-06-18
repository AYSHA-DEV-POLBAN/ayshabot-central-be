const User = require("../users/model");
const { logHistoryCreated } = require('../logHistory/controller');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = {
	signup: async (req, res) => {
		try {
			const { role_id, name, email, password, status, verify_email } = req.body;

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = await User.create({
				role_id,
				name,
				email,
				password: hashedPassword,
				status,
				verify_email,
			});

			status_code = 200;
			message = "Yeay! Sign Up Successfully.";

			// LOGGING
			logHistoryCreated(null, null, User.getTableName().tableName, "SIGN UP - SUCCESS", JSON.stringify(req.body, null, 4), "Status : " + status_code + "Message : " + message);
			
			res.status(status_code).json({ status_code : status_code, message : message, data: newUser });

		} catch (err) {
			status_code = 200;

			// LOGGING
			// logHistoryCreated(null, null, User.getTableName().tableName, "SIGN UP - ERROR", "-", "Status : " + status_code + "Message : " + err.message || "internal server error");

			console.log(err);
			res.status(500).json({ message: err.message || "internal server error" });
		}
	},
	signin: async (req, res) => {
		const { email, password } = req.body;
		User.findOne({ where: { email: email } }).then((user) => {
			if (user) {
				const checkpassword = bcrypt.compareSync(password, user.password);
				if (checkpassword) {
					if (user.verify_email == 1) {
						if (user.status == 1) {
							const token = jwt.sign(
							{
								user: {
									id: user.id,
									role_id: user.role_id,
									name: user.name,
									email: user.email,
								},
							},
							config.jwtKey
							);

							data = {};
							data.token = token;
							data.role_id = user.role_id;

							status = 200;
							message = "Yeay! Sign In Successfully.";


							// LOGGING
							logHistoryCreated(null, null, User.getTableName().tableName, "SIGN IN - SUCCESS", JSON.stringify(token, null, 4), "Status : " + status + "Message : " + message);

							res.status(status).json({ data: data });
						}
						else {
							status = 200;
							message = "akun sedang non-akti";

							// LOGGING
							logHistoryCreated(null, null, User.getTableName().tableName, "SIGN IN - ERROR", "-", "akun sedang non-aktif");

							res.status(403).json({  message: "akun sedang non-aktif", });
						}	
					}
					else {
						// LOGGING
						logHistoryCreated(null, null, User.getTableName().tableName, "ERROR", "-", "email belum di aktivasi oleh administrator");
						
						res.status(403).json({
							message: "email belum di aktivasi oleh administrator",
						});
					}
				} else {
					// LOGGING
					logHistoryCreated(null, null, User.getTableName().tableName, "ERROR", "-", "password yang di masukan salah / akun belum terdaftar");
					
					res.status(403).json({
						message: "password yang di masukan salah / akun belum terdaftar",
					});
				}
			} else {
				// LOGGING
				logHistoryCreated(null, null, User.getTableName().tableName, "ERROR", "-", "email yang anda masukan belum terdaftar");
				
				res.status(403).json({
					message: "email yang anda masukan belum terdaftar",
				});
			}
		});
	},
};
