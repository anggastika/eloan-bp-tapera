const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const stokRumahController = require('../controllers/stokRumahController');

router.use(authenticate);

router.get('/perumahan', stokRumahController.listPerumahan);
router.get('/rumah', stokRumahController.listRumah);
router.get('/rumah/detail', stokRumahController.detailRumah);

module.exports = router;
