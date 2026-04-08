const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  module: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  reference_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  request_data: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  response_data: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'audit_logs'
});

module.exports = AuditLog;
