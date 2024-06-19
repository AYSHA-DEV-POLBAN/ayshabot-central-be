const { DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const CategoryInformation = require("../categoryInformation/model");

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
			references: {
				model: CategoryInformation,
				key: 'id'
			}
		},
		title_information: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isUnique: async function (value) {
					try {
						const count = await this.constructor.count({
							where: { title_information: value },
						});
						if (count !== 0) {
							throw new Error("title information is already stored.");
						}
					} catch (err) {
						throw err;
					}
				},
			},
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
		chunk_total: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		chunk_ids_min: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		chunk_ids_max: {
			type: DataTypes.INTEGER,
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
		tableName: "information",
		schema: "public",
	}
);

// Definisikan asosiasi
Information.belongsTo(CategoryInformation, { foreignKey: 'category_information_id' });

module.exports = Information;
