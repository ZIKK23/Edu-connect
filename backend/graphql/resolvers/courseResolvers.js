// Course Resolvers
const { coursesPool, studentsPool } = require('../../db');

const courseResolvers = {
  Query: {
    // Get all courses
    courses: async () => {
      try {
        const result = await coursesPool.query(
          'SELECT course_id AS id, title, credits, lecturer, created_at FROM courses ORDER BY course_id'
        );
        return result.rows;
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw new Error('Failed to fetch courses');
      }
    },

    // Get single course by ID
    course: async (_, { id }) => {
      try {
        const result = await coursesPool.query(
          'SELECT course_id AS id, title, credits, lecturer, created_at FROM courses WHERE course_id = $1',
          [id]
        );
        if (result.rows.length === 0) {
          throw new Error('Course not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
      }
    },
  },

  Mutation: {
    // Create new course
    createCourse: async (_, { input }) => {
      const { title, credits, lecturer } = input;
      try {
        const result = await coursesPool.query(
          'INSERT INTO courses (title, credits, lecturer) VALUES ($1, $2, $3) RETURNING course_id AS id, title, credits, lecturer, created_at',
          [title, credits, lecturer]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error creating course:', error);
        throw new Error('Failed to create course');
      }
    },

    // Update course
    updateCourse: async (_, { id, input }) => {
      const { title, credits, lecturer } = input;
      try {
        const result = await coursesPool.query(
          'UPDATE courses SET title = $1, credits = $2, lecturer = $3 WHERE course_id = $4 RETURNING course_id AS id, title, credits, lecturer, created_at',
          [title, credits, lecturer, id]
        );
        if (result.rows.length === 0) {
          throw new Error('Course not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error updating course:', error);
        throw new Error('Failed to update course');
      }
    },

    // Delete course
    deleteCourse: async (_, { id }) => {
      try {
        // Check if course has any enrollments
        const enrollmentCheck = await studentsPool.query(
          'SELECT COUNT(*) FROM enrollments WHERE course_id = $1',
          [id]
        );
        
        const enrollmentCount = parseInt(enrollmentCheck.rows[0].count);
        if (enrollmentCount > 0) {
          throw new Error(`Cannot delete course. ${enrollmentCount} student(s) are currently enrolled in this course.`);
        }

        // Proceed with deletion if no enrollments
        const result = await coursesPool.query(
          'DELETE FROM courses WHERE course_id = $1',
          [id]
        );
        if (result.rowCount === 0) {
          throw new Error('Course not found');
        }
        return true;
      } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
      }
    },
  },
};

module.exports = courseResolvers;
