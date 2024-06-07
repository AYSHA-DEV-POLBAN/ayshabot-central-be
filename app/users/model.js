const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: {
					args: true,
					msg: "Email address is not valid.",
				},
				isUnique: async function (value) {
					try {
						const count = await this.constructor.count({
							where: { email: value },
						});
						if (count !== 0) {
							throw new Error("Email address is already registered.");
						}
					} catch (err) {
						throw err;
					}
				},
			},
		},
		verify_email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		tableName: "users",
		schema: "public",
	}
);

module.exports = User;
