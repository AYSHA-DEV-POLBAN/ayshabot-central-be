'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions',{
      id:{
         type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      transaction_number:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      transaction_date:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      user_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },
    
      transaction_type_id:{
        type: Sequelize.INTEGER,
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
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
