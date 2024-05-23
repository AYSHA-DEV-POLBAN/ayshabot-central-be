const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const ProductCategory = sequelize.define('ProductCategory', {
  ProductId:{
    type: DataTypes.INTEGER,
    allowNull: true,
    
  },
  CategoryId:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
}, {
  tableName: 'ProductCategory',
  schema: 'public',
});

module.exports = ProductCategory;
