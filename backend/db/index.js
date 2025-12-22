// Database connection pools for PostgreSQL (Dual Database Setup)
const { Pool } = require("pg");
require("dotenv").config();

// Pool for Student Database (students + enrollments)
const studentsPool = new Pool({
  host: process.env.DB_HOST_STUDENTS || "localhost",
  port: process.env.DB_PORT_STUDENTS || 5432,
  user: process.env.DB_USER || "educonnect",
  password: process.env.DB_PASSWORD || "educonnect123",
  database: process.env.DB_NAME_STUDENTS || "educonnect_students_db",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Pool for Course Database (courses)
const coursesPool = new Pool({
  host: process.env.DB_HOST_COURSES || "localhost",
  port: process.env.DB_PORT_COURSES || 5433,
  user: process.env.DB_USER || "educonnect",
  password: process.env.DB_PASSWORD || "educonnect123",
  database: process.env.DB_NAME_COURSES || "educonnect_courses_db",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connections
studentsPool.on("connect", () => {
  console.log("✅ Connected to Students PostgreSQL database");
});

studentsPool.on("error", (err) => {
  console.error("❌ Unexpected error on Students database client", err);
  process.exit(-1);
});

coursesPool.on("connect", () => {
  console.log("✅ Connected to Courses PostgreSQL database");
});

coursesPool.on("error", (err) => {
  console.error("❌ Unexpected error on Courses database client", err);
  process.exit(-1);
});

module.exports = {
  studentsPool,
  coursesPool,
};
