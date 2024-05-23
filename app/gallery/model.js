const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Gallery = sequelize.define('Galleries', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  link: {
    type: DataTypes.STRING,
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
  
}, {
  tableName: 'Galleries',
  schema: 'public',
});

module.exports = Gallery;
