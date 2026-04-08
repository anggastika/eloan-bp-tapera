const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ kode: '401', status: 'Unauthorized', message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ kode: '401', status: 'Unauthorized', message: 'User tidak valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ kode: '401', status: 'Unauthorized', message: 'Token tidak valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ kode: '403', status: 'Forbidden', message: 'Akses ditolak' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
