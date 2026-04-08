const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const parameterController = require('../controllers/parameterController');

router.use(authenticate);

router.get('/produk', parameterController.listProduk);
router.get('/produk/detail', parameterController.detailProduk);
router.get('/provinsi', parameterController.getProvinsi);
router.get('/kabupaten', parameterController.getKabupaten);
router.get('/kecamatan', parameterController.getKecamatan);
router.get('/kelurahan', parameterController.getKelurahan);
router.get('/proses', parameterController.listProses);
router.get('/limit', parameterController.cekLimit);
router.get('/error-code', parameterController.listErrorCode);
router.get('/segmen-pekerjaan', parameterController.getSegmenPekerjaan);
router.get('/status-pernikahan', parameterController.getStatusPernikahan);

module.exports = router;
