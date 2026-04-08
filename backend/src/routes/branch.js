const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const branchController = require('../controllers/branchController');

router.use(authenticate);

router.post('/', authorize('admin'), auditLog('BRANCH', 'CREATE'), branchController.create);
router.get('/', branchController.list);
router.get('/tapera/list', branchController.listFromTapera);
router.get('/:id', branchController.detail);
router.put('/:id', authorize('admin'), auditLog('BRANCH', 'UPDATE'), branchController.update);

module.exports = router;
