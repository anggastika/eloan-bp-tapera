const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const pengajuanController = require('../controllers/pengajuanController');

router.use(authenticate);

router.get('/dashboard', pengajuanController.getDashboardStats);
router.post('/', auditLog('PENGAJUAN', 'CREATE'), pengajuanController.create);
router.post('/:id/submit', auditLog('PENGAJUAN', 'SUBMIT_TAPERA'), pengajuanController.submitToTapera);
router.post('/follow-up', auditLog('PENGAJUAN', 'FOLLOW_UP'), pengajuanController.followUp);
router.get('/', pengajuanController.list);
router.get('/inquiry', pengajuanController.inquiryByNik);
router.get('/tapera/list', pengajuanController.listFromTapera);
router.get('/tapera/detail', pengajuanController.detailFromTapera);
router.get('/:id', pengajuanController.detail);
router.put('/:id', auditLog('PENGAJUAN', 'UPDATE'), pengajuanController.update);

module.exports = router;
