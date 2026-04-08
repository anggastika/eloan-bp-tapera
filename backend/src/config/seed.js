require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./database');
const { User, Branch, MitraConfig } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ alter: true });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin@bank.co.id' },
      defaults: {
        nama: 'Administrator',
        email: 'admin@bank.co.id',
        password: hashedPassword,
        role: 'admin',
        is_active: true
      }
    });

    await Branch.findOrCreate({
      where: { kode_cabang: 'PUSAT' },
      defaults: {
        kode_cabang: 'PUSAT',
        nama_cabang: 'Kantor Pusat',
        alamat: 'Jakarta',
        is_active: true
      }
    });

    await MitraConfig.findOrCreate({
      where: { kode_mitra: '11111001' },
      defaults: {
        kode_mitra: '11111001',
        nama_mitra: 'Bank Mitra',
        base_url: 'https://apidev.tapera.go.id:8443',
        client_id: 'demo-client-id',
        client_secret: 'demo-client-secret',
        environment: 'development',
        is_active: true
      }
    });

    console.log('Seed data created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
