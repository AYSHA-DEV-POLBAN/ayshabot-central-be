const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const Chroma = sequelize.define(
	"Chroma",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		last_chunks_ids: {
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
		tableName: "chroma",
		schema: "public",
	}
);

module.exports = Chroma;
