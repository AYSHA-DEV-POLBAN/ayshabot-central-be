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
			
			res.status(status_code).json({ status_code : status_code, status_message : message, data: newUser });

		} catch (err) {
			status_code = 500;
			message = err.message || "internal server error" ;

			// LOGGING
			logHistoryCreated(null, null, User.getTableName().tableName, "SIGN UP - ERROR", "-", "Status : " + status_code + "Message : " + err.message || "internal server error");

			// console.log(err);
			res.status(status_code).json({ status_code : status_code, status_message : message });
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
							data.user_id = user.id;
							data.name = user.name;

							status_code = 200;
							message = "Yeay! Sign In Successfully.";


							// LOGGING
							logHistoryCreated(null, null, User.getTableName().tableName, "SIGN IN - SUCCESS", JSON.stringify(token, null, 4), "Status : " + status_code + "Message : " + message);

							res.status(status_code).json({ status_code : status_code, status_message : message, data: data });
						}
						else {
							status_code = 403;
							message = "Upss! Akun sedang non-aktif";

							// LOGGING
							logHistoryCreated(null, null, User.getTableName().tableName, "SIGN IN - ERROR", "-", "Status : " + status_code + "Message : " + message);

							res.status(status_code).json({  status_code : status_code, status_message : message });
						}	
					}
					else {
						status_code = 403;
						message = "Upss! Email belum di aktivasi oleh administrator";

						// LOGGING
						logHistoryCreated(null, null, User.getTableName().tableName, "ERROR", "-", "Status : " + status_code + "Message : " + message);
						
						res.status(status_code).json({ status_code : status_code, status_message : message });
					}
				} else {
					status_code = 403;
					message = "Upss! Password yang di masukan salah / akun belum terdaftar";

					// LOGGING
					logHistoryCreated(null, null, User.getTableName().tableName, "ERROR", "-", "Status : " + status_code + "Message : " + message);
					
					res.status(status_code).json({ status_code : status_code, status_message : message });
				}
			} else {
				status_code = 403;
				message = "Upss! Email yang anda masukan belum terdaftar";
				
				// LOGGING
				logHistoryCreated(null, null, User.getTableName().tableName, "ERROR", "-", "Status : " + status_code + "Message : " + message);
				
				res.status(status_code).json({ status_code : status_code, status_message : message });
			}
		});
	},
};
