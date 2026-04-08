const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dokumen = sequelize.define('Dokumen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  jenis_dokumen: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'KTP, SLIP_GAJI, KK, NPWP, etc.'
  },
  nama_file: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  file_path: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ukuran: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'dokumen'
});

module.exports = Dokumen;
