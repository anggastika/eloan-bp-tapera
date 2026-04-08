const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pic = sequelize.define('Pic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  no_hp: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  kode_cabang: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  zona: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'pic'
});

module.exports = Pic;
