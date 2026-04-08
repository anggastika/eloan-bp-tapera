const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MitraConfig = sequelize.define('MitraConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_mitra: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nama_mitra: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  base_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  client_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  client_secret: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  token_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  environment: {
    type: DataTypes.ENUM('development', 'staging', 'production'),
    defaultValue: 'development'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'mitra_configs'
});

module.exports = MitraConfig;
