const { SP3K, Pengajuan } = require('../models');
const taperaApi = require('../services/taperaApi');
const logger = require('../config/logger');

const submit = async (req, res) => {
  try {
    const sp3k = await SP3K.create(req.body);
    res.status(201).json({ kode: '0000000000', status: 'Sukses', data: sp3k });
  } catch (error) {
    logger.error('Create SP3K error:', error);
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const submitToTapera = async (req, res) => {
  try {
    const result = await taperaApi.submitSP3K(
      req.body,
      req.headers['cabang-mitra'] || req.user.kode_cabang,
      req.user.email
    );

    if (result.kode === '0000000000') {
      await SP3K.update(
        { status: 'SUBMITTED', nomor_sp3k: result.data.nomor_sp3k },
        { where: { id_pengajuan: req.body.id_pengajuan } }
      );
      await Pengajuan.update(
        { status_proses: 'SP3K' },
        { where: { id_pengajuan: req.body.id_pengajuan } }
      );
    }

    res.json(result);
  } catch (error) {
    logger.error('Submit SP3K to Tapera error:', error);
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { count, rows } = await SP3K.findAndCountAll({
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
    const sp3k = await SP3K.findByPk(req.params.id, {
      include: [{ model: Pengajuan, as: 'pengajuan' }]
    });
    if (!sp3k) return res.status(404).json({ kode: '404', status: 'Error', message: 'SP3K tidak ditemukan' });
    res.json({ kode: '0000000000', status: 'Sukses', data: sp3k });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const listFromTapera = async (req, res) => {
  try {
    const result = await taperaApi.listSP3K(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = { submit, submitToTapera, list, detail, listFromTapera };
