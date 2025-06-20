# backend-stokbarang by Ferry Amaludin
Aplikasi ini merupakan sistem manajemen stok barang sederhana yang dibuat oleh **Ferry Amaludin** memiliki dua peran pengguna: **admin** dan **operator**. Aplikasi memungkinkan pengguna melakukan login, pengelolaan data barang, transaksi stok masuk/keluar, dan manajemen user. Fokus utama adalah menjaga **akurasi stok** meskipun terjadi **akses simultan (race condition)**.

---

## 2. Teknologi yang Digunakan

* **Backend**: Node.js + Express.js
* **Database**: PostgreSQL
* **Auth**: JSON Web Token (JWT)
* **Testing Race Condition**: Grafana k6
* **Deployment**: Vercel
* **Database** : Railway

---

## 3. Struktur Database

### Tabel: `barang`

| Kolom       | Tipe    | Keterangan                |
| ----------- | ------- | ------------------------- |
| id          | UUID    | Primary key               |
| nama        | TEXT    | Nama barang               |
| kode        | TEXT    | Kode unik barang          |
| stok        | INTEGER | Jumlah stok terkini       |
| lokasi\_rak | TEXT    | Lokasi penyimpanan barang |

---

### Tabel: `users`

| Kolom    | Tipe | Keterangan                                          |
| -------- | ---- | --------------------------------------------------- |
| id       | UUID | Primary key                                         |
| name     | TEXT | Nama lengkap user                                   |
| username | TEXT | Username unik                                       |
| password | TEXT | Password yang dienkripsi                            |
| role     | TEXT | admin / operator (dibatasi melalui constraint enum) |

---

### Tabel: `transaksi`

| Kolom           | Tipe        | Keterangan                                    |
| --------------- | ----------- | --------------------------------------------- |
| id              | UUID        | Primary key                                   |
| id\_barang      | UUID        | Foreign key ke tabel `barang`                 |
| tanggal         | TIMESTAMPTZ | Tanggal dan waktu transaksi                   |
| tipe\_transaksi | TEXT        | 'masuk' atau 'keluar' (enum constraint)       |
| jumlah          | INTEGER     | Jumlah barang yang ditransaksikan (harus > 0) |
| id\_user        | UUID        | Foreign key ke tabel `users`, bisa `NULL`     |

---

## 4. Fitur Aplikasi

### 1. Login Admin & Operator

* Menggunakan JWT untuk otentikasi.
* Role `admin` dan `operator` dibedakan untuk pembatasan fitur.

### 2. CRUD Barang

* Tambah, edit, hapus, dan lihat daftar barang.
* Cek duplikasi kode barang saat tambah/edit.
* Cek stok real-time saat transaksi.

### 3. CRUD User Operator

* Hanya **admin** yang dapat mengelola user.
* **Operator** tidak dapat menambah user lain.
* Password disimpan secara **terenkripsi**.

### 4. CRUD Transaksi

* Tipe transaksi:

  * **Masuk** → Menambahkan stok barang.
  * **Keluar** → Mengurangi stok barang.
* Setiap transaksi dicatat dengan informasi:

  * Barang, tanggal, jumlah, dan siapa pengguna yang membuatnya.
* Update stok dilakukan dengan **`FOR UPDATE`** untuk menghindari race condition.

### 5. Notifikasi Stok Kurang dari 10

* Sistem dapat menandai atau memberi peringatan jika stok suatu barang kurang dari 10 unit.

### 6. Uji Race Condition (Grafana k6)

* Simulasi dilakukan dengan mengakses endpoint transaksi secara bersamaan dari banyak pengguna.
* Pastikan hasil akhir **stok konsisten dan tidak negatif**.

### 7. Akurasi Stok dalam Kondisi Simultan

* Gunakan transaksi SQL dan `SELECT ... FOR UPDATE` untuk **lock baris data barang** saat transaksi berlangsung.
* Komit dan rollback digunakan untuk menjaga **integritas data**.

### 8. Deployment

* Backend dapat dideploy ke layanan seperti:

  * **Vercel**
* Menggunakan file `.env` untuk menyimpan variabel rahasia seperti koneksi database dan secret JWT.

---