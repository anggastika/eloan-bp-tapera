const { Branch, Pic } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const create = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: branch });
  } catch (error) {
    logger.error('Create branch error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await Branch.findAndCountAll({
      order: [['nama_cabang', 'ASC']],
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

const detail = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [{ model: Pic, as: 'pics' }]
    });
    if (!branch) return res.status(404).json({ kode: '404', status: 'Error', message: 'Cabang tidak ditemukan' });
    res.json({ kode: '0000000000', status: 'Sukses', data: branch });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) return res.status(404).json({ kode: '404', status: 'Error', message: 'Cabang tidak ditemukan' });
    await branch.update(req.body);
    res.json({ kode: '0000000000', status: 'Sukses', data: branch });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listCabang(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = { create, list, detail, update, listFromTapera };
