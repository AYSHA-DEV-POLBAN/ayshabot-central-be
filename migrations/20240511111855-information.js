'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Information',{
      id:{
        type: Sequelize.INTEGER,
       allowNull: false,
       autoIncrement: true,
       primaryKey: true
     },
      name:{
      type: Sequelize.STRING,
      allowNull: false, 
     },
      file:{
      type: Sequelize.TEXT,
      allowNull: false,
     },
     status:{
      type: Sequelize.STRING,
      allowNull: false,
     },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Information', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
