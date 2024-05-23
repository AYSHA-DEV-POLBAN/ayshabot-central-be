const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const ProductGallery = sequelize.define('ProductGallery', {
  ProductId:{
    type: DataTypes.INTEGER,
    allowNull: true,
    
  },
  GalleryId:{
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
  tableName: 'ProductGallery',
  schema: 'public',
});

module.exports = ProductGallery;
