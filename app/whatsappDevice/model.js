const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const WhatsappDevice = sequelize.define(
	"WhatsappDevice",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		session_device: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isUnique: async function (value) {
					try {
						const count = await this.constructor.count({
							where: { session_device: value },
						});
						if (count !== 0) {
							throw new Error("session device is already stored.");
						}
					} catch (err) {
						throw err;
					}
				},
			},
		},
		status_device: {
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
		tableName: "whatsapp_device",
		schema: "public",
	}
);

module.exports = WhatsappDevice;
