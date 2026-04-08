const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SP3K = sequelize.define('SP3K', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  nomor_sp3k: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  tanggal_sp3k: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  harga_rumah: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  uang_muka: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  nilai_pembiayaan: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  tenor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bunga: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  jenis_akad: {
    type: DataTypes.STRING(20),
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
  tableName: 'sp3k'
});

module.exports = SP3K;
