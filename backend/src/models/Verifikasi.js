const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Verifikasi = sequelize.define('Verifikasi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  jenis_verifikasi: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'LAYAK_HUNI, LAYAK_KBR, LAYAK_KRR'
  },
  atap: { type: DataTypes.BOOLEAN, allowNull: true },
  lantai: { type: DataTypes.BOOLEAN, allowNull: true },
  dinding: { type: DataTypes.BOOLEAN, allowNull: true },
  pintu: { type: DataTypes.BOOLEAN, allowNull: true },
  kusen: { type: DataTypes.BOOLEAN, allowNull: true },
  jendela: { type: DataTypes.BOOLEAN, allowNull: true },
  air: { type: DataTypes.BOOLEAN, allowNull: true },
  septic_tank: { type: DataTypes.BOOLEAN, allowNull: true },
  listrik: { type: DataTypes.BOOLEAN, allowNull: true },
  bukti_hak_tanah: { type: DataTypes.BOOLEAN, allowNull: true },
  bukti_pbg: { type: DataTypes.BOOLEAN, allowNull: true },
  lat: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  lng: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  pic_lapor: { type: DataTypes.BOOLEAN, defaultValue: false },
  pemohon_lapor: { type: DataTypes.BOOLEAN, defaultValue: false },
  pengembang_lapor: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDING'
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'verifikasi'
});

module.exports = Verifikasi;
