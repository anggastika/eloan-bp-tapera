const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Akad = sequelize.define('Akad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  nomor_akad: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  tanggal_akad: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  notaris: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nomor_rekening: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'PENDING'
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'akad'
});

module.exports = Akad;
