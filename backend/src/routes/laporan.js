const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const laporanController = require('../controllers/laporanController');

router.use(authenticate);

router.post('/outstanding', auditLog('LAPORAN', 'OUTSTANDING'), laporanController.submitOutstanding);
router.post('/outstanding/submit', auditLog('LAPORAN', 'SUBMIT_OUTSTANDING'), laporanController.submitOutstandingToTapera);
router.post('/pelunasan', auditLog('LAPORAN', 'PELUNASAN'), laporanController.submitPelunasan);
router.get('/', laporanController.list);

module.exports = router;
