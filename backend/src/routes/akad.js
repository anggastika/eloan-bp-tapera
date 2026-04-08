const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const akadController = require('../controllers/akadController');

router.use(authenticate);

router.post('/', auditLog('AKAD', 'CREATE'), akadController.submit);
router.post('/submit', auditLog('AKAD', 'SUBMIT_TAPERA'), akadController.submitToTapera);
router.get('/', akadController.list);
router.get('/tapera/list', akadController.listFromTapera);
router.get('/:id', akadController.detail);

module.exports = router;
