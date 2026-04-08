const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const verifikasiController = require('../controllers/verifikasiController');

router.use(authenticate);

router.post('/layak-huni', auditLog('VERIFIKASI', 'LAYAK_HUNI'), verifikasiController.submitLayakHuni);
router.post('/layak-huni/submit', auditLog('VERIFIKASI', 'SUBMIT_LAYAK_HUNI'), verifikasiController.submitLayakHuniToTapera);
router.post('/layak-kbr', auditLog('VERIFIKASI', 'LAYAK_KBR'), verifikasiController.submitLayakKbr);
router.post('/layak-krr', auditLog('VERIFIKASI', 'LAYAK_KRR'), verifikasiController.submitLayakKrr);
router.get('/cek', verifikasiController.cekKelayakan);
router.get('/', verifikasiController.list);

module.exports = router;
