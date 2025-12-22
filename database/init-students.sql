-- Student Database (students dan enrollments)

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES students (student_id) ON DELETE CASCADE
);

-- Insert seed data for students
INSERT INTO
    students (name, email)
VALUES (
        'Alya Pratama',
        'alya.pratama@educonnect.id'
    ),
    (
        'Bagus Saputra',
        'bagus.saputra@educonnect.id'
    ),
    (
        'Citra Lestari',
        'citra.lestari@educonnect.id'
    );

-- Insert seed data for enrollments
INSERT INTO
    enrollments (student_id, course_id, grade)
VALUES (1, 1, 'A'),
    (1, 2, 'B+'),
    (2, 2, 'A-'),
    (3, 3, 'B');