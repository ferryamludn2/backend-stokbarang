const pool = require('../db');

exports.create = async (req, res) => {
  const { id_barang, tanggal, tipe_transaksi, jumlah } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const stokResult = await client.query(
      'SELECT stok FROM barang WHERE id = $1 FOR UPDATE',
      [id_barang]
    );
    if (!stokResult.rowCount) throw new Error('Barang not found');

    let stok = stokResult.rows[0].stok;
    stok = tipe_transaksi === 'masuk'
      ? stok + jumlah
      : stok - jumlah;

    if (stok < 0) throw new Error('Stok tidak cukup');

    await client.query(
      'UPDATE barang SET stok = $1 WHERE id = $2',
      [stok, id_barang]
    );

    const trx = await client.query(
      `INSERT INTO transaksi 
        (id_barang, tanggal, tipe_transaksi, jumlah, id_user)
       VALUES 
        ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_barang, tanggal, tipe_transaksi, jumlah, req.user.id]
    );

    await client.query('COMMIT');
    res.status(201).json(trx.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: e.message });
  } finally {
    client.release();
  }
};

exports.getAll = async (req, res) => {
  const result = await pool.query('SELECT * FROM transaksi');
  res.json(result.rows);
};
