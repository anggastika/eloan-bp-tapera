const { Laporan, Pengajuan } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submitOutstanding = async (req, res) => {
  try {
    const laporan = await Laporan.create({ ...req.body, jenis_laporan: 'OUTSTANDING' });
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: laporan });
  } catch (error) {
    logger.error('Create laporan error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const submitOutstandingToTapera = async (req, res) => {
  try {
    const result = await taperaApi.submitLaporanOutstanding(req.body, req.user.kode_cabang, req.user.email);
    if (result.kode === '0000000000') {
      await Laporan.update({ status: 'SUBMITTED' }, { where: { id_pengajuan: req.body.id_pengajuan, jenis_laporan: 'OUTSTANDING' } });
    }
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const submitPelunasan = async (req, res) => {
  try {
    const result = await taperaApi.submitLaporanPelunasan(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10, jenis_laporan } = req.query;
    const where = {};
    if (jenis_laporan) where.jenis_laporan = jenis_laporan;

    const { count, rows } = await Laporan.findAndCountAll({
      where,
      include: [{ model: Pengajuan, as: 'pengajuan', attributes: ['nik_pemohon', 'nama_pemohon'] }],
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

module.exports = { submitOutstanding, submitOutstandingToTapera, submitPelunasan, list };
