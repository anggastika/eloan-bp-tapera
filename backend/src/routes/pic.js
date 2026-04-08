const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/auditLog');
const picController = require('../controllers/picController');

router.use(authenticate);

router.post('/', authorize('admin', 'cabang'), auditLog('PIC', 'CREATE'), picController.create);
router.post('/tapera', authorize('admin'), auditLog('PIC', 'TAMBAH_TAPERA'), picController.tambahToTapera);
router.post('/assign-role', authorize('admin'), auditLog('PIC', 'ASSIGN_ROLE'), picController.assignRole);
router.get('/', picController.list);
router.get('/tapera/list', picController.listFromTapera);
router.get('/:id', picController.detail);
router.put('/:id', authorize('admin', 'cabang'), auditLog('PIC', 'UPDATE'), picController.update);
router.delete('/:id', authorize('admin'), auditLog('PIC', 'DELETE'), picController.remove);

module.exports = router;
