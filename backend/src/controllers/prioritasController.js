const { Prioritas } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submit = async (req, res) => {
  try {
    const prioritas = await Prioritas.create(req.body);
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: prioritas });
  } catch (error) {
    logger.error('Create prioritas error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const submitToTapera = async (req, res) => {
  try {
    const result = await taperaApi.submitPrioritas(req.body, req.user.kode_cabang, req.user.email);
    if (result.kode === '0000000000') {
      await Prioritas.update({ status: 'SUBMITTED' }, { where: { nik_pemohon: req.body.nik_pemohon } });
    }
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await Prioritas.findAndCountAll({
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

const cekPrioritas = async (req, res) => {
  try {
    const result = await taperaApi.cekPrioritas(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listPrioritas(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const updatePrioritas = async (req, res) => {
  try {
    const result = await taperaApi.updatePrioritas(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = { submit, submitToTapera, list, cekPrioritas, listFromTapera, updatePrioritas };
