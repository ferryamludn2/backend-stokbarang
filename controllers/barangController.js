const pool = require('../db');
exports.getAll = async (req, res) => {
  const result = await pool.query('SELECT * FROM barang');
  res.json(result.rows);
};

exports.getLowStock = async (req, res) => {
  const result = await pool.query('SELECT * FROM barang WHERE stok < 10');
  res.json(result.rows);
};
exports.create = async (req, res) => {
  const { nama, kode, stok, lokasi_rak } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO barang (nama, kode, stok, lokasi_rak) VALUES ($1, $2, $3, $4) RETURNING *',
      [nama, kode, stok, lokasi_rak]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: `Barang dengan kode '${kode}' sudah ada. Gunakan kode yang berbeda.`,
      });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nama, kode, stok, lokasi_rak } = req.body;
  const result = await pool.query(
    'UPDATE barang SET nama=$1, kode=$2, stok=$3, lokasi_rak=$4 WHERE id=$5 RETURNING *',
    [nama, kode, stok, lokasi_rak, id]
  );
  res.json(result.rows[0]);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM barang WHERE id = $1', [id]);
  res.json({ message: 'Barang deleted' });
};