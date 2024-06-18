'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "whatsapp_device",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        session_device: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status_device: {
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("whatsapp_device", {
      schema: "public", // Menentukan skema tabel
    });
  }
};
