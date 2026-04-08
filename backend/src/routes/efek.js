const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const efekController = require('../controllers/efekController');

router.use(authenticate);

router.post('/amortisasi', auditLog('EFEK', 'AMORTISASI'), efekController.submitAmortisasi);
router.post('/', auditLog('EFEK', 'SUBMIT'), efekController.submitEfek);
router.get('/tapera/list', efekController.listFromTapera);
router.get('/tapera/detail', efekController.detailFromTapera);
router.get('/', efekController.list);

module.exports = router;
