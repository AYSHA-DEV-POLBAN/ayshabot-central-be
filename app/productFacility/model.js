const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const ProductFacility = sequelize.define('ProductFacility', {
  ProductId:{
    type: DataTypes.INTEGER,
    allowNull: true,
    
  },
  FacilityId:{
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
  tableName: 'ProductFacility',
  schema: 'public',
});

module.exports = ProductFacility;
