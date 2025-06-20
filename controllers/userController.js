const bcrypt = require('bcryptjs');
const pool = require('../db');
exports.getAll = async (req, res) => {
  const result = await pool.query("SELECT id, name, username, role FROM users WHERE role = 'operator'");
  res.json(result.rows);
};

exports.create = async (req, res) => {
  const { name, username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, username, hashed, 'operator']
  );
  res.status(201).json(result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'UPDATE users SET name=$1, password=$2 WHERE id=$3 RETURNING *',
    [name, hashed, id]
  );
  res.json(result.rows[0]);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.json({ message: 'User deleted' });
};
