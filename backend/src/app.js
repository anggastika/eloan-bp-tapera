require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./config/logger');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pengajuan', require('./routes/pengajuan'));
app.use('/api/sp3k', require('./routes/sp3k'));
app.use('/api/akad', require('./routes/akad'));
app.use('/api/pencairan', require('./routes/pencairan'));
app.use('/api/verifikasi', require('./routes/verifikasi'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/efek', require('./routes/efek'));
app.use('/api/pic', require('./routes/pic'));
app.use('/api/branch', require('./routes/branch'));
app.use('/api/parameter', require('./routes/parameter'));
app.use('/api/stok-rumah', require('./routes/stokRumah'));
app.use('/api/prioritas', require('./routes/prioritas'));
app.use('/api/angsuran', require('./routes/angsuran'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Error handler
app.use((err, _req, res, _next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ kode: '500', status: 'Error', message: 'Internal Server Error' });
});

// Database sync and start
async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Models synchronized');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
