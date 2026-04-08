const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const prioritasController = require('../controllers/prioritasController');

router.use(authenticate);

router.post('/', auditLog('PRIORITAS', 'CREATE'), prioritasController.submit);
router.post('/submit', auditLog('PRIORITAS', 'SUBMIT_TAPERA'), prioritasController.submitToTapera);
router.post('/update', auditLog('PRIORITAS', 'UPDATE'), prioritasController.updatePrioritas);
router.get('/', prioritasController.list);
router.get('/tapera/list', prioritasController.listFromTapera);
router.get('/cek', prioritasController.cekPrioritas);

module.exports = router;
