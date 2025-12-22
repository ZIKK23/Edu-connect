-- Course Database (courses)

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    credits SMALLINT NOT NULL CHECK (credits > 0),
    lecturer VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed data for courses
INSERT INTO
    courses (title, credits, lecturer)
VALUES (
        'Pemrograman Web Lanjut',
        3,
        'Dr. Nirmala Sari'
    ),
    (
        'Sistem Terdistribusi',
        4,
        'Ir. Damar Wibowo'
    ),
    (
        'Data Mining',
        3,
        'Dr. Surya Ananta'
    );