'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Facilties',{
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
       icon:{
        type: Sequelize.STRING,
        allowNull: true,
       
       },
       status_id:{
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
    await queryInterface.dropTable('Facilties', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
