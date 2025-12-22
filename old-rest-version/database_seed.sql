-- database_seed.sql
-- Skrip untuk menyiapkan database EduConnect beserta data contoh.

CREATE DATABASE IF NOT EXISTS educonnect_db;
USE educonnect_db;

DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    credits TINYINT UNSIGNED NOT NULL,
    lecturer VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

INSERT INTO students (name, email) VALUES
('Alya Pratama', 'alya.pratama@educonnect.id'),
('Bagus Saputra', 'bagus.saputra@educonnect.id'),
('Citra Lestari', 'citra.lestari@educonnect.id');

INSERT INTO courses (title, credits, lecturer) VALUES
('Pemrograman Web Lanjut', 3, 'Dr. Nirmala Sari'),
('Sistem Terdistribusi', 4, 'Ir. Damar Wibowo'),
('Data Mining', 3, 'Dr. Surya Ananta');

INSERT INTO enrollments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 2, 'A-'),
(3, 3, 'B');
