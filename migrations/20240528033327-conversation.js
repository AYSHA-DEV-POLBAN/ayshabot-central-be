"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"conversation",
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				client_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				question_client: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				response_system: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				chunk_relevant: {
					type: Sequelize.TEXT,
					allowNull: true,
				},
				bill: {
					type: Sequelize.DECIMAL(25, 10),
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
		await queryInterface.dropTable("conversation", {
			schema: "public", // Menentukan skema tabel
		});
	},
};
