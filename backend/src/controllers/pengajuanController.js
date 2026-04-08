const { Pengajuan, SP3K, Akad, Dokumen, Verifikasi } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const pengajuan = await Pengajuan.create({
      ...req.body,
      status_pengajuan: 'DRAFT',
      pic_email: req.user.email,
      kode_cabang: req.user.kode_cabang || req.body.kode_cabang,
      tanggal_pengajuan: new Date()
    });

    res.status(201).json({
      kode: '0000000000',
      status: 'Sukses',
      data: pengajuan
    });
  } catch (error) {
    logger.error('Create pengajuan error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const submitToTapera = async (req, res) => {
  try {
    const { id } = req.params;
    const pengajuan = await Pengajuan.findByPk(id);
    if (!pengajuan) {
      return res.status(404).json({ kode: '404', status: 'Error', message: 'Pengajuan tidak ditemukan' });
    }

    const payload = {
      nik_pemohon: pengajuan.nik_pemohon,
      nama_pemohon: pengajuan.nama_pemohon,
      tanggal_lahir: pengajuan.tanggal_lahir,
      nomor_kk: pengajuan.nomor_kk,
      nomor_hp: pengajuan.nomor_hp,
      email: pengajuan.email,
      npwp: pengajuan.npwp,
      penghasilan: pengajuan.penghasilan,
      status_nikah: pengajuan.status_nikah,
      pekerjaan: pengajuan.pekerjaan,
      nik_pasangan: pengajuan.nik_pasangan,
      nama_pasangan: pengajuan.nama_pasangan,
      penghasilan_pasangan: pengajuan.penghasilan_pasangan,
      produk: pengajuan.produk,
      jenis_pembiayaan: pengajuan.jenis_pembiayaan,
      prinsip_pembiayaan: pengajuan.prinsip_pembiayaan,
      id_lokasi: pengajuan.id_lokasi,
      kode_wilayah_agunan: pengajuan.kode_wilayah_agunan,
      alamat_agunan: pengajuan.alamat_agunan,
      rt_agunan: pengajuan.rt_agunan,
      rw_agunan: pengajuan.rw_agunan,
      blok_agunan: pengajuan.blok_agunan,
      nomor_unit_agunan: pengajuan.nomor_unit_agunan
    };

    const result = await taperaApi.submitPengajuan(payload, pengajuan.kode_cabang, req.user.email);

    if (result.kode === '0000000000') {
      await pengajuan.update({
        id_pengajuan: result.data.id_pengajuan,
        status_pengajuan: 'SUBMITTED',
        status_proses: result.data.status_proses || 'PENGAJUAN'
      });
    }

    res.json(result);
  } catch (error) {
    logger.error('Submit to Tapera error:', error);
    res.status(error.status || 500).json({
      kode: String(error.status || 500),
      status: 'Error',
      message: error.message
    });
  }
};

const followUp = async (req, res) => {
  try {
    const result = await taperaApi.followUpPengajuan(
      req.body,
      req.headers['cabang-mitra'] || req.user.kode_cabang,
      req.user.email
    );

    if (result.kode === '0000000000') {
      await Pengajuan.update(
        { status_proses: 'FOLLOW_UP' },
        { where: { id_pengajuan: req.body.id_pengajuan } }
      );
    }

    res.json(result);
  } catch (error) {
    logger.error('Follow up error:', error);
    res.status(error.status || 500).json({
      kode: String(error.status || 500),
      status: 'Error',
      message: error.message
    });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10, status, search, tanggalAwal, tanggalAkhir } = req.query;
    const where = {};

    if (status) where.status_pengajuan = status;
    if (search) {
      where[Op.or] = [
        { nik_pemohon: { [Op.like]: `%${search}%` } },
        { nama_pemohon: { [Op.like]: `%${search}%` } },
        { id_pengajuan: { [Op.like]: `%${search}%` } }
      ];
    }
    if (tanggalAwal && tanggalAkhir) {
      where.tanggal_pengajuan = {
        [Op.between]: [new Date(tanggalAwal), new Date(tanggalAkhir)]
      };
    }

    if (req.user.role === 'pic') {
      where.pic_email = req.user.email;
    } else if (req.user.role === 'cabang') {
      where.kode_cabang = req.user.kode_cabang;
    }

    const { count, rows } = await Pengajuan.findAndCountAll({
      where,
      include: [
        { model: SP3K, as: 'sp3k', required: false },
        { model: Akad, as: 'akad', required: false }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit)
    });

    res.json({
      kode: '0000000000',
      status: 'Sukses',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('List pengajuan error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const detail = async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findByPk(req.params.id, {
      include: [
        { model: SP3K, as: 'sp3k', required: false },
        { model: Akad, as: 'akad', required: false },
        { model: Dokumen, as: 'dokumen', required: false },
        { model: Verifikasi, as: 'verifikasi', required: false }
      ]
    });

    if (!pengajuan) {
      return res.status(404).json({ kode: '404', status: 'Error', message: 'Pengajuan tidak ditemukan' });
    }

    res.json({ kode: '0000000000', status: 'Sukses', data: pengajuan });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const pengajuan = await Pengajuan.findByPk(req.params.id);
    if (!pengajuan) {
      return res.status(404).json({ kode: '404', status: 'Error', message: 'Pengajuan tidak ditemukan' });
    }

    if (pengajuan.status_pengajuan !== 'DRAFT') {
      return res.status(400).json({ kode: '400', status: 'Error', message: 'Hanya pengajuan DRAFT yang bisa diubah' });
    }

    await pengajuan.update(req.body);
    res.json({ kode: '0000000000', status: 'Sukses', data: pengajuan });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const inquiryByNik = async (req, res) => {
  try {
    const result = await taperaApi.inquiryByNik(
      { nik: req.query.nik },
      req.user.kode_cabang,
      req.user.email
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      kode: String(error.status || 500),
      status: 'Error',
      message: error.message
    });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listPengajuan(
      req.query,
      req.user.kode_cabang,
      req.user.email
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      kode: String(error.status || 500),
      status: 'Error',
      message: error.message
    });
  }
};

const detailFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.detailPengajuan(
      { idPengajuan: req.query.idPengajuan, nik: req.query.nik },
      req.user.kode_cabang,
      req.user.email
    );
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      kode: String(error.status || 500),
      status: 'Error',
      message: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'pic') where.pic_email = req.user.email;
    if (req.user.role === 'cabang') where.kode_cabang = req.user.kode_cabang;

    const totalPengajuan = await Pengajuan.count({ where });
    const draft = await Pengajuan.count({ where: { ...where, status_pengajuan: 'DRAFT' } });
    const submitted = await Pengajuan.count({ where: { ...where, status_pengajuan: 'SUBMITTED' } });
    const approved = await Pengajuan.count({ where: { ...where, status_pengajuan: 'APPROVED' } });
    const rejected = await Pengajuan.count({ where: { ...where, status_pengajuan: 'REJECTED' } });

    const recentPengajuan = await Pengajuan.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      kode: '0000000000',
      status: 'Sukses',
      data: {
        total_pengajuan: totalPengajuan,
        draft,
        submitted,
        approved,
        rejected,
        recent: recentPengajuan
      }
    });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

module.exports = {
  create, submitToTapera, followUp, list, detail, update,
  inquiryByNik, listFromTapera, detailFromTapera, getDashboardStats
};
