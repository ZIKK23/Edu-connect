// api-gateway/server.js
const express = require('express');
const axios = require('axios'); // Untuk melakukan HTTP request ke service lain
const cors = require('cors'); // Penting untuk frontend

const app = express();
const PORT = 4000;
const STUDENT_SERVICE_URL = 'http://localhost:3001';
const COURSE_SERVICE_URL = 'http://localhost:3002';

// Izinkan permintaan dari frontend (misalnya di port 5000 jika menggunakan React)
app.use(cors({ origin: 'http://localhost:5000' })); 
app.use(express.json());

const handleProxyError = (error, res, fallbackMessage) => {
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    console.error('Gateway error:', error.message);
    return res.status(500).json({ message: fallbackMessage });
};

// --- Endpoint Gateway untuk Student Service ---
app.get('/gateway/users', async (req, res) => {
    try {
        const response = await axios.get(`${STUDENT_SERVICE_URL}/users`); 
        res.status(200).json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal mengambil data siswa');
    }
});

app.post('/gateway/users', async (req, res) => {
    try {
        const response = await axios.post(`${STUDENT_SERVICE_URL}/users`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal membuat data siswa');
    }
});

app.put('/gateway/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.put(`${STUDENT_SERVICE_URL}/users/${id}`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal memperbarui data siswa');
    }
});

app.delete('/gateway/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.delete(`${STUDENT_SERVICE_URL}/users/${id}`);
        res.status(response.status).send(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal menghapus data siswa');
    }
});

// --- Endpoint Gateway untuk Course Service ---
app.get('/gateway/courses', async (req, res) => {
    try {
        const response = await axios.get(`${COURSE_SERVICE_URL}/courses`); 
        res.status(200).json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal mengambil data kursus');
    }
});

app.post('/gateway/courses', async (req, res) => {
    try {
        const response = await axios.post(`${COURSE_SERVICE_URL}/courses`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal membuat data kursus');
    }
});

app.put('/gateway/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.put(`${COURSE_SERVICE_URL}/courses/${id}`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal memperbarui data kursus');
    }
});

app.delete('/gateway/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.delete(`${COURSE_SERVICE_URL}/courses/${id}`);
        res.status(response.status).send(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Gagal menghapus data kursus');
    }
});

// --- Integrasi Antar Layanan (Course Service memanggil Student Service) ---
// Contoh: Mendapatkan daftar kursus yang diambil oleh seorang siswa (membutuhkan data siswa)
app.get('/gateway/user-courses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // 1. Panggil Student Service untuk mendapatkan data siswa (Contoh integrasi antar service)
        const userResponse = await axios.get(`${STUDENT_SERVICE_URL}/users/${userId}`);
        const userData = userResponse.data;

        // 2. Panggil Course Service untuk mendapatkan kursus yang diambil oleh siswa tersebut
        // (Asumsi ada endpoint /courses/by-user/:userId di Course Service)
        const courseResponse = await axios.get(`${COURSE_SERVICE_URL}/courses/by-user/${userId}`);
        const courseData = courseResponse.data;

        // Gabungkan dan kirim data [cite: 21]
        res.status(200).json({
            student: userData,
            courses_enrolled: courseData
        });

    } catch (error) {
        handleProxyError(error, res, 'Gagal memproses data terintegrasi');
    }
});


app.listen(PORT, () => {
    console.log(`API Gateway berjalan di http://localhost:${PORT}`);
});
