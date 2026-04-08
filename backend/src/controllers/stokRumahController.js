const taperaApi = require('../services/taperaApi');

const listPerumahan = async (req, res) => {
  try {
    const result = await taperaApi.listPerumahan(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listRumah = async (req, res) => {
  try {
    const result = await taperaApi.listRumah(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const detailRumah = async (req, res) => {
  try {
    const result = await taperaApi.detailRumah(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = { listPerumahan, listRumah, detailRumah };
