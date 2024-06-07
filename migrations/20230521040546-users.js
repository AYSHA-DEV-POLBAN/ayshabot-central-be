"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable(
			"users",
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				role_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				email: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				verify_email: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				password: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				status: {
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

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("users", {
			schema: "public", // Menentukan skema tabel
		});
	},
};
