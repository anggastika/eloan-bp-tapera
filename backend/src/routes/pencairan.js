const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const pencairanController = require('../controllers/pencairanController');

router.use(authenticate);

router.post('/', auditLog('PENCAIRAN', 'CREATE'), pencairanController.submit);
router.post('/submit', auditLog('PENCAIRAN', 'SUBMIT_TAPERA'), pencairanController.submitToTapera);
router.get('/', pencairanController.list);
router.get('/tapera/list', pencairanController.listFromTapera);
router.get('/:id', pencairanController.detail);

module.exports = router;
