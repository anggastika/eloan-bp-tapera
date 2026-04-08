const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pencairan = sequelize.define('Pencairan', {
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
  tipe_program: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'TAPERA or FLPP'
  },
  nilai_pencairan: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  tanggal_pencairan: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nomor_rekening_pencairan: {
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
  tableName: 'pencairan'
});

module.exports = Pencairan;
