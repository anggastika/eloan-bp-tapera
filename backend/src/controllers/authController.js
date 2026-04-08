const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Branch } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, is_active: true },
      include: [{ model: Branch, as: 'branch' }]
    });

    if (!user) {
      return res.status(401).json({ kode: '401', status: 'Error', message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ kode: '401', status: 'Error', message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      kode: '0000000000',
      status: 'Sukses',
      data: {
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          kode_cabang: user.kode_cabang,
          branch: user.branch
        }
      }
    });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { nama, email, password, role, kode_cabang, no_hp } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ kode: '400', status: 'Error', message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || 'pic',
      kode_cabang,
      no_hp
    });

    res.status(201).json({
      kode: '0000000000',
      status: 'Sukses',
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Branch, as: 'branch' }]
    });
    res.json({ kode: '0000000000', status: 'Sukses', data: user });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ kode: '400', status: 'Error', message: 'Password lama salah' });
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.json({ kode: '0000000000', status: 'Sukses', message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ kode: '500', status: 'Error', message: error.message });
  }
};

module.exports = { login, register, getProfile, changePassword };
