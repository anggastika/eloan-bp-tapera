const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Angsuran = sequelize.define('Angsuran', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  nomor_batch: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  angsuran_ke: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_jatuh_tempo: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nilai_angsuran_pokok: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  nilai_angsuran_bunga: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  total_angsuran: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  sisa_pokok: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  status_bayar: {
    type: DataTypes.STRING(20),
    defaultValue: 'BELUM_BAYAR'
  }
}, {
  tableName: 'angsuran'
});

module.exports = Angsuran;
