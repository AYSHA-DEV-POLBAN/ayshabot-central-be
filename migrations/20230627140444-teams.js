'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Teams',{
      id:{
         type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      alias:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      image:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      established_at:{
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
    await queryInterface.dropTable('Teams', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
