const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const angsuranController = require('../controllers/angsuranController');

router.use(authenticate);

router.post('/jadwal', auditLog('ANGSURAN', 'SUBMIT_JADWAL'), angsuranController.submitJadwal);
router.get('/7525', angsuranController.list7525);
router.get('/9010', angsuranController.list9010);
router.get('/7525/detail', angsuranController.detail7525);
router.get('/9010/detail', angsuranController.detail9010);
router.get('/', angsuranController.listLocal);

module.exports = router;
