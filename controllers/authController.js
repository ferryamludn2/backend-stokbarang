const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (!user.rows.length) return res.status(400).json({ message: 'User not found' });
  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token });
};

exports.register = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    if (!['admin', 'operator'].includes(role)) {
      return res.status(400).json({ message: 'Role harus admin atau operator' });
    }
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, username, role',
      [name, username, hashedPassword, role]
    );

    res.status(201).json({
      message: 'Register berhasil',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};