const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Command = sequelize.define('Command', {
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
  respond:{
  type: DataTypes.TEXT,
  allowNull: false,
 },
 status:{
  type: DataTypes.TEXT,
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
  tableName: 'Command',
  schema: 'public',
});

module.exports = Command;
