const { Verifikasi, Pengajuan } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submitLayakHuni = async (req, res) => {
  try {
    const verifikasi = await Verifikasi.create({
      ...req.body,
      jenis_verifikasi: 'LAYAK_HUNI'
    });
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: verifikasi });
  } catch (error) {
    logger.error('Create verifikasi error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const submitLayakHuniToTapera = async (req, res) => {
  try {
    const result = await taperaApi.layakHuniPic(req.body, req.user.kode_cabang, req.user.email);

    if (result.kode === '0000000000') {
      await Verifikasi.update(
        { status: 'SUBMITTED', pic_lapor: true, keterangan: result.data.keterangan },
        { where: { id_pengajuan: req.body.id_pengajuan, jenis_verifikasi: 'LAYAK_HUNI' } }
      );
    }

    res.json(result);
  } catch (error) {
    logger.error('Submit layak huni to Tapera error:', error);
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const submitLayakKbr = async (req, res) => {
  try {
    const result = await taperaApi.layakBangunRumah(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const submitLayakKrr = async (req, res) => {
  try {
    const result = await taperaApi.layakRenovasiRumah(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const cekKelayakan = async (req, res) => {
  try {
    const result = await taperaApi.cekKelayakan(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await Verifikasi.findAndCountAll({
      include: [{ model: Pengajuan, as: 'pengajuan', attributes: ['nik_pemohon', 'nama_pemohon', 'jenis_pembiayaan'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit)
    });

    res.json({
      kode: '0000000000',
      status: 'Sukses',
      data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

module.exports = { submitLayakHuni, submitLayakHuniToTapera, submitLayakKbr, submitLayakKrr, cekKelayakan, list };
