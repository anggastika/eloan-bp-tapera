const { Angsuran } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submitJadwal = async (req, res) => {
  try {
    const result = await taperaApi.submitJadwalAngsuran(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list7525 = async (req, res) => {
  try {
    const result = await taperaApi.listAngsuran7525(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list9010 = async (req, res) => {
  try {
    const result = await taperaApi.listAngsuran9010(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const detail7525 = async (req, res) => {
  try {
    const result = await taperaApi.detailAngsuran7525(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const detail9010 = async (req, res) => {
  try {
    const result = await taperaApi.detailAngsuran9010(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listLocal = async (req, res) => {
  try {
    const { page = 0, limit = 10, id_pengajuan } = req.query;
    const where = {};
    if (id_pengajuan) where.id_pengajuan = id_pengajuan;

    const { count, rows } = await Angsuran.findAndCountAll({
      where,
      order: [['angsuran_ke', 'ASC']],
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

module.exports = { submitJadwal, list7525, list9010, detail7525, detail9010, listLocal };
