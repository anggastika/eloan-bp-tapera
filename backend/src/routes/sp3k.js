const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const sp3kController = require('../controllers/sp3kController');

router.use(authenticate);

router.post('/', auditLog('SP3K', 'CREATE'), sp3kController.submit);
router.post('/submit', auditLog('SP3K', 'SUBMIT_TAPERA'), sp3kController.submitToTapera);
router.get('/', sp3kController.list);
router.get('/tapera/list', sp3kController.listFromTapera);
router.get('/:id', sp3kController.detail);

module.exports = router;
