"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"category_information",
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				name_category_information: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				description_category_information: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				},
			},
			{
				schema: "public", // Menentukan skema tabel
			}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("category_information", {
			schema: "public", // Menentukan skema tabel
		});
	},
};
