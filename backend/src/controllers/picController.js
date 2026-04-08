const { Pic, Branch } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const create = async (req, res) => {
  try {
    const pic = await Pic.create(req.body);
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: pic });
  } catch (error) {
    logger.error('Create PIC error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const tambahToTapera = async (req, res) => {
  try {
    const result = await taperaApi.tambahPic(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await Pic.findAndCountAll({
      include: [{ model: Branch, as: 'branch' }],
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

const detail = async (req, res) => {
  try {
    const pic = await Pic.findByPk(req.params.id, {
      include: [{ model: Branch, as: 'branch' }]
    });
    if (!pic) return res.status(404).json({ kode: '404', status: 'Error', message: 'PIC tidak ditemukan' });
    res.json({ kode: '0000000000', status: 'Sukses', data: pic });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const pic = await Pic.findByPk(req.params.id);
    if (!pic) return res.status(404).json({ kode: '404', status: 'Error', message: 'PIC tidak ditemukan' });
    await pic.update(req.body);
    res.json({ kode: '0000000000', status: 'Sukses', data: pic });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const pic = await Pic.findByPk(req.params.id);
    if (!pic) return res.status(404).json({ kode: '404', status: 'Error', message: 'PIC tidak ditemukan' });
    await pic.update({ is_active: false });
    res.json({ kode: '0000000000', status: 'Sukses', message: 'PIC berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const assignRole = async (req, res) => {
  try {
    const result = await taperaApi.assignRolePic(req.body, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listPic(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = { create, tambahToTapera, list, detail, update, remove, assignRole, listFromTapera };
