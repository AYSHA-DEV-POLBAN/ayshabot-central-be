'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions_Lines',{
      id:{
         type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      transaction_id:{
        type: Sequelize.INTEGER,
        allowNull: false, 
        
      },
      product_id:{
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
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions_Lines', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
