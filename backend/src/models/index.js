const User = require('./User');
const Branch = require('./Branch');
const MitraConfig = require('./MitraConfig');
const Pengajuan = require('./Pengajuan');
const SP3K = require('./SP3K');
const Akad = require('./Akad');
const Pencairan = require('./Pencairan');
const Laporan = require('./Laporan');
const Pic = require('./Pic');
const Dokumen = require('./Dokumen');
const Verifikasi = require('./Verifikasi');
const Angsuran = require('./Angsuran');
const Efek = require('./Efek');
const Prioritas = require('./Prioritas');
const AuditLog = require('./AuditLog');

// Associations
User.belongsTo(Branch, { foreignKey: 'kode_cabang', targetKey: 'kode_cabang', as: 'branch' });
Branch.hasMany(User, { foreignKey: 'kode_cabang', sourceKey: 'kode_cabang', as: 'users' });

Pengajuan.hasOne(SP3K, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'sp3k' });
SP3K.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pengajuan.hasOne(Akad, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'akad' });
Akad.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pengajuan.hasMany(Pencairan, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'pencairan' });
Pencairan.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pengajuan.hasMany(Laporan, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'laporan' });
Laporan.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pengajuan.hasMany(Dokumen, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'dokumen' });
Dokumen.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pengajuan.hasMany(Verifikasi, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'verifikasi' });
Verifikasi.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pengajuan.hasMany(Angsuran, { foreignKey: 'id_pengajuan', sourceKey: 'id_pengajuan', as: 'angsuran' });
Angsuran.belongsTo(Pengajuan, { foreignKey: 'id_pengajuan', targetKey: 'id_pengajuan', as: 'pengajuan' });

Pic.belongsTo(Branch, { foreignKey: 'kode_cabang', targetKey: 'kode_cabang', as: 'branch' });
Branch.hasMany(Pic, { foreignKey: 'kode_cabang', sourceKey: 'kode_cabang', as: 'pics' });

module.exports = {
  User,
  Branch,
  MitraConfig,
  Pengajuan,
  SP3K,
  Akad,
  Pencairan,
  Laporan,
  Pic,
  Dokumen,
  Verifikasi,
  Angsuran,
  Efek,
  Prioritas,
  AuditLog
};
