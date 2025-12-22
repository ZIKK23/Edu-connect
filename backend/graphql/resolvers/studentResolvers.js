// Student Resolvers
const { studentsPool } = require('../../db');

const studentResolvers = {
  Query: {
    // Get all students
    students: async () => {
      try {
        const result = await studentsPool.query(
          'SELECT student_id AS id, name, email, created_at FROM students ORDER BY student_id'
        );
        return result.rows;
      } catch (error) {
        console.error('Error fetching students:', error);
        throw new Error('Failed to fetch students');
      }
    },

    // Get single student by ID
    student: async (_, { id }) => {
      try {
        const result = await studentsPool.query(
          'SELECT student_id AS id, name, email, created_at FROM students WHERE student_id = $1',
          [id]
        );
        if (result.rows.length === 0) {
          throw new Error('Student not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
      }
    },
  },

  Mutation: {
    // Create new student
    createStudent: async (_, { input }) => {
      const { name, email } = input;
      try {
        const result = await studentsPool.query(
          'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING student_id AS id, name, email, created_at',
          [name, email]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error creating student:', error);
        if (error.code === '23505') { // Unique violation
          throw new Error('Email already exists');
        }
        throw new Error('Failed to create student');
      }
    },

    // Update student
    updateStudent: async (_, { id, input }) => {
      const { name, email } = input;
      try {
        const result = await studentsPool.query(
          'UPDATE students SET name = $1, email = $2 WHERE student_id = $3 RETURNING student_id AS id, name, email, created_at',
          [name, email, id]
        );
        if (result.rows.length === 0) {
          throw new Error('Student not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error updating student:', error);
        if (error.code === '23505') {
          throw new Error('Email already exists');
        }
        throw new Error('Failed to update student');
      }
    },

    // Delete student
    deleteStudent: async (_, { id }) => {
      try {
        // Check if student has any enrollments
        const enrollmentCheck = await studentsPool.query(
          'SELECT COUNT(*) FROM enrollments WHERE student_id = $1',
          [id]
        );
        
        const enrollmentCount = parseInt(enrollmentCheck.rows[0].count);
        if (enrollmentCount > 0) {
          throw new Error(`Cannot delete student. This student is currently enrolled in ${enrollmentCount} course(s).`);
        }

        // Proceed with deletion if no enrollments
        const result = await studentsPool.query(
          'DELETE FROM students WHERE student_id = $1',
          [id]
        );
        if (result.rowCount === 0) {
          throw new Error('Student not found');
        }
        return true;
      } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
    },
  },
};

module.exports = studentResolvers;
