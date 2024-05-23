'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Locations',{
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
      province_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },

      city_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      }, 
      district_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },
      sub_district_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        
      },
      latitude:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      longitude:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      address:{
        type: Sequelize.TEXT,
        allowNull: true,
        
      },
      type:{
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Locations', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
