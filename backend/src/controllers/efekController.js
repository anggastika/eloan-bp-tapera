const { Efek } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submitAmortisasi = async (req, res) => {
  try {
    const result = await taperaApi.submitAmortisasi(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const submitEfek = async (req, res) => {
  try {
    const efek = await Efek.create(req.body);

    const result = await taperaApi.submitEfek(req.body, req.user.kode_cabang, req.user.email);
    if (result.kode === '0000000000') {
      await efek.update({ kode_efek: result.data.kode_efek, status_efek: 'SUBMITTED' });
    }

    res.json(result);
  } catch (error) {
    logger.error('Submit efek error:', error);
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listEfek(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const detailFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.detailEfek(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await Efek.findAndCountAll({
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

module.exports = { submitAmortisasi, submitEfek, listFromTapera, detailFromTapera, list };
