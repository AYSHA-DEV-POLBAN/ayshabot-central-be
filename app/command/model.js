const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const Command = sequelize.define(
	"Command",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		name_command: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isUnique: async function (value) {
					try {
						const count = await this.constructor.count({
							where: { name_command: value },
						});
						if (count !== 0) {
							throw new Error("name command is already stored.");
						}
					} catch (err) {
						throw err;
					}
				},
			},
		},
		response_command: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status_command: {
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
		tableName: "command",
		schema: "public",
	}
);

module.exports = Command;
