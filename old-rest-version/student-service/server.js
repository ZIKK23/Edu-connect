// student-service/server.js

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const localEnvPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '..', '.env');
const envPath = fs.existsSync(localEnvPath) ? localEnvPath : rootEnvPath;
dotenv.config({ path: envPath }); // Pastikan variabel lingkungan terbaca

const express = require('express');
const mysql = require('mysql2/promise'); // Menggunakan promise
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const PORT = 3001;

app.use(express.json()); // Middleware untuk parsing JSON

// --- Konfigurasi Database ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// --- Endpoint API Siswa (Users) ---

// Inisialisasi koneksi MySQL
const pool = mysql.createPool(dbConfig);

// Endpoint GET /users (Contoh: Menampilkan semua siswa)
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT student_id AS id, name, email FROM students');
        res.status(200).json(rows); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint GET /users/:id (Contoh: Menampilkan siswa berdasarkan ID)
app.get('/users/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT student_id AS id, name, email FROM students WHERE student_id = ?', [studentId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint POST /users (Membuat siswa baru)
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO students (name, email) VALUES (?, ?)',
            [name, email]
        );
        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint PUT /users/:id (Memperbarui data siswa)
app.put('/users/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE students SET name = ?, email = ? WHERE student_id = ?',
            [name, email, studentId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ id: Number(studentId), name, email });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint DELETE /users/:id (Menghapus siswa)
app.delete('/users/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [studentId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- Dokumentasi Swagger (OpenAPI) ---
// Muat file YAML (akan dibuat di langkah berikutnya)
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Mulai Server ---
app.listen(PORT, () => {
    console.log(`Student Service berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi Swagger tersedia di http://localhost:${PORT}/api-docs`);
});
