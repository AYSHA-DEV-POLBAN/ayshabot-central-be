const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Information = sequelize.define('Information', {
  id:{
    type: DataTypes.INTEGER,
   allowNull: false,
   autoIncrement: true,
   primaryKey: true
 },
  name:{
  type: DataTypes.STRING,
  allowNull: false, 
 },
  file:{
  type: DataTypes.TEXT,
  allowNull: false,
 },
 status:{
  type: DataTypes.STRING,
  allowNull: false,
 },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
}, {
  tableName: 'Information',
  schema: 'public',
});

module.exports = Information;
