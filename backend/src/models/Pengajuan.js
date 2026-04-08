const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pengajuan = sequelize.define('Pengajuan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: true,
    unique: true,
    comment: 'ID from BP Tapera'
  },
  nik_pemohon: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  nama_pemohon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tanggal_lahir: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nomor_kk: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  nomor_hp: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  npwp: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  penghasilan: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  status_nikah: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  pekerjaan: {
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
  tipe_program: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'TAPERA or FLPP'
  },
  jenis_pembiayaan: {
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: 'KPR, KBR, KRR'
  },
  prinsip_pembiayaan: {
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: 'KONVENSIONAL or SYARIAH'
  },
  id_lokasi: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  kode_wilayah_agunan: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  alamat_agunan: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  rt_agunan: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  rw_agunan: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  blok_agunan: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  nomor_unit_agunan: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  harga_rumah: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  uang_muka: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  nilai_pembiayaan: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: true
  },
  tenor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bunga: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  status_pengajuan: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: 'DRAFT'
  },
  status_proses: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  kode_cabang: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pic_email: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tanggal_pengajuan: {
    type: DataTypes.DATE,
    allowNull: true
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pengajuan'
});

module.exports = Pengajuan;
