'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Reference_has_Operationals',{
      id:{
         type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      reference_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },
      operational_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
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
      
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reference_has_Operationals', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
