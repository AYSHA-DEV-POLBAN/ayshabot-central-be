'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products',{
      id:{
         type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
       cover:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      name:{
        type: Sequelize.STRING,
        allowNull: true,
        
      },
      description:{
        type: Sequelize.TEXT,
        allowNull: true,
        
      },
    
      price:{
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0
      },
      product_type_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
       
      },
      locationId:{
        type: Sequelize.INTEGER,
        allowNull: true,
       
      },
      status_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
       
      },
      vendor_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
       
      },
      OperationalId:{
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
    await queryInterface.dropTable('Products', {
      schema: 'public', // Menentukan skema tabel
    });
  }
};
