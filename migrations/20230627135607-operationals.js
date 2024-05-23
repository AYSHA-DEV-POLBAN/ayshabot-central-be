'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Operationals',{
      id:{
         type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      product_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },
      day_start_id:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      day_end_id:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      time_start:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      time_end:{
        type: Sequelize.STRING,
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
      deletedAt: {
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
    await queryInterface.dropTable('Operationals', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
