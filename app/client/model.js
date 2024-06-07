const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const Client = sequelize.define(
	"Client",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		whatsapp_number: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isUnique: async function (value) {
					try {
						const count = await this.constructor.count({
							where: { whatsapp_number: value },
						});
						if (count !== 0) {
							throw new Error("whatsapp number is already stored.");
						}
					} catch (err) {
						throw err;
					}
				},
			},
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
		tableName: "client",
		schema: "public",
	}
);

module.exports = Client;
