const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Facility = sequelize.define('Facilities', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
 
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
 
  status_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Facilities',
  schema: 'public',
});

module.exports = Facility;
