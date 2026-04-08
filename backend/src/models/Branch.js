const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_cabang: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nama_cabang: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  kota: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  provinsi: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'branches'
});

module.exports = Branch;
