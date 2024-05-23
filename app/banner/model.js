const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const Banner = sequelize.define('Banners', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    // validate: {
    //   notNull: {
    //     msg: 'Please enter your name'
    //   }
    // }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
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
  tableName: 'Banners',
  schema: 'public',
});

module.exports = Banner;
