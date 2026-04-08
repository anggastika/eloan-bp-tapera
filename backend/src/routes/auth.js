const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/login', [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
  validate
], authController.login);

router.post('/register', [
  body('nama').notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  validate
], authController.register);

router.get('/profile', authenticate, authController.getProfile);

router.put('/change-password', authenticate, [
  body('old_password').notEmpty().withMessage('Password lama wajib diisi'),
  body('new_password').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
  validate
], authController.changePassword);

module.exports = router;
