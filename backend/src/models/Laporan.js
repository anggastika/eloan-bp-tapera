const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Laporan = sequelize.define('Laporan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  jenis_laporan: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'OUTSTANDING, PELUNASAN_DIPERCEPAT'
  },
  periode: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'YYYY-MM'
  },
  sisa_pokok: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  nilai_angsuran: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  status_kolektibilitas: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDING'
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'laporan'
});

module.exports = Laporan;
