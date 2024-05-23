const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Operationals = sequelize.define('Operationals', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  day_start_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  day_end_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time_start: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time_end: {
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
  tableName: 'Operationals',
  schema: 'public',
});

module.exports = Operationals;
