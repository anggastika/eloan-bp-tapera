const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Efek = sequelize.define('Efek', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomor_batch: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  kode_efek: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  nama_efek: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tenor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nilai_efek: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  bunga: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  jumlah_kali_bayar: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  jenis_efek: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: 'LTN or NCD'
  },
  skema_porsi_dana: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '100 or 75'
  },
  nilai_pencairan: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  nilai_pelunasan_dipercepat: {
    type: DataTypes.DECIMAL(19, 2),
    defaultValue: 0
  },
  tanggal_efek: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status_efek: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'efek'
});

module.exports = Efek;
