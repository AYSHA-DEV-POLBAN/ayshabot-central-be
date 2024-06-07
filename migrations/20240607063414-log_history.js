"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"log_history",
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				client_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				table_name: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				action_name: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				action_data: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				log_description: {
					type: Sequelize.TEXT,
					allowNull: true,
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
		await queryInterface.dropTable("log_history", {
			schema: "public", // Menentukan skema tabel
		});
	},
};
