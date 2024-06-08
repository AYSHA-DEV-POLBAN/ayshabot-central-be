const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const LogHistory = sequelize.define(
	"LogHistory",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		client_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		table_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		action_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		action_data: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		log_description: {
			type: DataTypes.TEXT,
			allowNull: true,
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
		tableName: "log_history",
		schema: "public",
	}
);

module.exports = LogHistory;
