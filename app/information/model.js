const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const Information = sequelize.define(
	"Information",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		category_information_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title_information: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description_information: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		file_path_information: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status_information: {
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
		tableName: "information",
		schema: "public",
	}
);

module.exports = Information;
