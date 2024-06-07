const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const CategoryInformation = sequelize.define(
	"CategoryInformation",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		name_category_information: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isUnique: async function (value) {
					try {
						const count = await this.constructor.count({
							where: { name_category_information: value },
						});
						if (count !== 0) {
							throw new Error("name category information is already stored.");
						}
					} catch (err) {
						throw err;
					}
				},
			},
		},
		description_category_information: {
			type: DataTypes.TEXT,
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
		tableName: "category_information",
		schema: "public",
	}
);

module.exports = CategoryInformation;
