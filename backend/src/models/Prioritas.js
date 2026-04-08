const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prioritas = sequelize.define('Prioritas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nik_pemohon: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  nama_pemohon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tanggal_lahir_pemohon: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nomor_kk_pemohon: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  nomor_hp_pemohon: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email_pemohon: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  npwp_pemohon: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  penghasilan_pemohon: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  status_nikah_pemohon: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  pekerjaan_pemohon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  nik_pasangan: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  nama_pasangan: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  penghasilan_pasangan: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  produk: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  id_lokasi: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  kode_wilayah_agunan: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  jenis_pembiayaan: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  prinsip_pembiayaan: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  prioritas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tipe_program: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'prioritas'
});

module.exports = Prioritas;
