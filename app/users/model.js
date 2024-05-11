const { DataTypes } = require('sequelize');
const sequelize = require('../../database/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: 'Email address is not valid.',
      },
      isUnique: async function (value) {
        try {
          const count = await this.constructor.count({ where: { email: value } });
          if (count !== 0) {
            throw new Error('Email address is already registered.');
          }
        } catch (err) {
          throw err;
        }
      },
    },
  },
  verify_email: {
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
  tableName: 'Users',
  schema: 'public',
});

module.exports = User;
