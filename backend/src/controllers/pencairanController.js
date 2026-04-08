const { Pencairan, Pengajuan } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submit = async (req, res) => {
  try {
    const pencairan = await Pencairan.create(req.body);
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: pencairan });
  } catch (error) {
    logger.error('Create Pencairan error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const submitToTapera = async (req, res) => {
  try {
    const { tipe_program } = req.body;
    let result;

    if (tipe_program === 'TAPERA') {
      result = await taperaApi.submitPencairanTapera(req.body, req.user.kode_cabang, req.user.email);
    } else {
      result = await taperaApi.submitPencairanFlpp(req.body, req.user.kode_cabang, req.user.email);
    }

    if (result.kode === '0000000000') {
      await Pencairan.update(
        { status: 'SUBMITTED', nomor_batch: result.data.nomor_batch },
        { where: { id_pengajuan: req.body.id_pengajuan, tipe_program } }
      );
      await Pengajuan.update(
        { status_proses: 'PENCAIRAN' },
        { where: { id_pengajuan: req.body.id_pengajuan } }
      );
    }

    res.json(result);
  } catch (error) {
    logger.error('Submit Pencairan to Tapera error:', error);
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await Pencairan.findAndCountAll({
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

const detail = async (req, res) => {
  try {
    const pencairan = await Pencairan.findByPk(req.params.id, {
      include: [{ model: Pengajuan, as: 'pengajuan' }]
    });
    if (!pencairan) return res.status(404).json({ kode: '404', status: 'Error', message: 'Pencairan tidak ditemukan' });
    res.json({ kode: '0000000000', status: 'Sukses', data: pencairan });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listPencairan(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = { submit, submitToTapera, list, detail, listFromTapera };
