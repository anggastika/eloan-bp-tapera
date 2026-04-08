const taperaApi = require('../services/taperaApi');

const listProduk = async (req, res) => {
  try {
    const result = await taperaApi.listProduk(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const detailProduk = async (req, res) => {
  try {
    const result = await taperaApi.detailProduk(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const getProvinsi = async (req, res) => {
  try {
    const result = await taperaApi.getProvinsi(req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const getKabupaten = async (req, res) => {
  try {
    const result = await taperaApi.getKabupaten(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const getKecamatan = async (req, res) => {
  try {
    const result = await taperaApi.getKecamatan(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const getKelurahan = async (req, res) => {
  try {
    const result = await taperaApi.getKelurahan(req.query, req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listProses = async (req, res) => {
  try {
    const result = await taperaApi.listProses(req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const cekLimit = async (req, res) => {
  try {
    const result = await taperaApi.cekLimit(req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const listErrorCode = async (req, res) => {
  try {
    const result = await taperaApi.listErrorCode(req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const getSegmenPekerjaan = async (req, res) => {
  try {
    const result = await taperaApi.getSegmenPekerjaan(req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

const getStatusPernikahan = async (req, res) => {
  try {
    const result = await taperaApi.getStatusPernikahan(req.user.kode_cabang, req.user.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ kode: String(error.status || 500), status: 'Error', message: error.message });
  }
};

module.exports = {
  listProduk, detailProduk, getProvinsi, getKabupaten, getKecamatan,
  getKelurahan, listProses, cekLimit, listErrorCode, getSegmenPekerjaan, getStatusPernikahan
};
