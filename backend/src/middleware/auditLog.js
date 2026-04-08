const { AuditLog } = require('../models');
const logger = require('../config/logger');

const auditLog = (module, action) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (data) => {
      try {
        await AuditLog.create({
          user_id: req.user ? req.user.id : null,
          action,
          module,
          reference_id: req.params.id || req.body.id_pengajuan || null,
          request_data: JSON.stringify(req.body).substring(0, 5000),
          response_data: JSON.stringify(data).substring(0, 5000),
          ip_address: req.ip,
          status: data.kode === '0000000000' || res.statusCode < 400 ? 'SUCCESS' : 'FAILED'
        });
      } catch (err) {
        logger.error('Audit log error:', err.message);
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = { auditLog };
