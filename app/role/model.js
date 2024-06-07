const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const Role = sequelize.define(
	"Role",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		name_role: {
			type: DataTypes.STRING,
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
		tableName: "role",
		schema: "public",
	}
);

module.exports = Role;
