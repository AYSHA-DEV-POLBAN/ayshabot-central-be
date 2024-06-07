"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"command",
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				name_command: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				response_command: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				status_command: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				createdAt: {
					type: Sequelize.DATE,
					allowNull: false
				},
				updatedAt: {
					type: Sequelize.DATE,
					allowNull: false
				},
			},
			{
				schema: "public", // Menentukan skema tabel
			}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("command", {
			schema: "public", // Menentukan skema tabel
		});
	},
};
