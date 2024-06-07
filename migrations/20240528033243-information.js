"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"information",
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				category_information_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				title_information: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				description_information: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				file_path_information: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				status_information: {
					type: Sequelize.INTEGER,
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
		await queryInterface.dropTable("information", {
			schema: "public", // Menentukan skema tabel
		});
	},
};
