// Enrollment Resolvers
const { studentsPool, coursesPool } = require('../../db');

const enrollmentResolvers = {
  Query: {
    // Get all enrollments
    enrollments: async () => {
      try {
        const result = await studentsPool.query(
          'SELECT enrollment_id AS id, student_id, course_id, grade, created_at FROM enrollments ORDER BY enrollment_id'
        );
        return result.rows;
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        throw new Error('Failed to fetch enrollments');
      }
    },

    // Get single enrollment by ID
    enrollment: async (_, { id }) => {
      try {
        const result = await studentsPool.query(
          'SELECT enrollment_id AS id, student_id, course_id, grade, created_at FROM enrollments WHERE enrollment_id = $1',
          [id]
        );
        if (result.rows.length === 0) {
          throw new Error('Enrollment not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching enrollment:', error);
        throw error;
      }
    },

    // Get student with their enrolled courses (Cross-Database Query)
    studentCourses: async (_, { studentId }) => {
      try {
        // Get student data from Student DB
        const studentResult = await studentsPool.query(
          'SELECT student_id AS id, name, email, created_at FROM students WHERE student_id = $1',
          [studentId]
        );

        if (studentResult.rows.length === 0) {
          throw new Error('Student not found');
        }

        // Get enrollments from Student DB
        const enrollmentsResult = await studentsPool.query(
          'SELECT course_id, grade FROM enrollments WHERE student_id = $1',
          [studentId]
        );

        // Get course details from Course DB for each enrollment
        const courses = [];
        for (const enrollment of enrollmentsResult.rows) {
          const courseResult = await coursesPool.query(
            'SELECT course_id AS id, title, credits, lecturer FROM courses WHERE course_id = $1',
            [enrollment.course_id]
          );
          if (courseResult.rows.length > 0) {
            courses.push({
              ...courseResult.rows[0],
              grade: enrollment.grade,
            });
          }
        }

        return {
          student: studentResult.rows[0],
          courses: courses,
        };
      } catch (error) {
        console.error('Error fetching student courses:', error);
        throw error;
      }
    },
  },

  Mutation: {
    // Create new enrollment
    createEnrollment: async (_, { input }) => {
      const { studentId, courseId, grade } = input;
      try {
        // Verify student exists in Student DB
        const studentCheck = await studentsPool.query(
          'SELECT student_id FROM students WHERE student_id = $1',
          [studentId]
        );
        if (studentCheck.rows.length === 0) {
          throw new Error('Student does not exist');
        }

        // Verify course exists in Course DB
        const courseCheck = await coursesPool.query(
          'SELECT course_id FROM courses WHERE course_id = $1',
          [courseId]
        );
        if (courseCheck.rows.length === 0) {
          throw new Error('Course does not exist');
        }

        // Create enrollment in Student DB
        const result = await studentsPool.query(
          'INSERT INTO enrollments (student_id, course_id, grade) VALUES ($1, $2, $3) RETURNING enrollment_id AS id, student_id, course_id, grade, created_at',
          [studentId, courseId, grade || null]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error creating enrollment:', error);
        throw error;
      }
    },

    // Update enrollment (grade)
    updateEnrollment: async (_, { id, input }) => {
      const { grade } = input;
      try {
        const result = await studentsPool.query(
          'UPDATE enrollments SET grade = $1 WHERE enrollment_id = $2 RETURNING enrollment_id AS id, student_id, course_id, grade, created_at',
          [grade, id]
        );
        if (result.rows.length === 0) {
          throw new Error('Enrollment not found');
        }
        return result.rows[0];
      } catch (error) {
        console.error('Error updating enrollment:', error);
        throw new Error('Failed to update enrollment');
      }
    },

    // Delete enrollment
    deleteEnrollment: async (_, { id }) => {
      try {
        const result = await studentsPool.query(
          'DELETE FROM enrollments WHERE enrollment_id = $1',
          [id]
        );
        if (result.rowCount === 0) {
          throw new Error('Enrollment not found');
        }
        return true;
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        throw new Error('Failed to delete enrollment');
      }
    },
  },

  // Field resolvers for Enrollment type (Cross-Database)
  Enrollment: {
    student: async (parent) => {
      try {
        const result = await studentsPool.query(
          'SELECT student_id AS id, name, email, created_at FROM students WHERE student_id = $1',
          [parent.student_id]
        );
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching student for enrollment:', error);
        return null;
      }
    },

    course: async (parent) => {
      try {
        const result = await coursesPool.query(
          'SELECT course_id AS id, title, credits, lecturer, created_at FROM courses WHERE course_id = $1',
          [parent.course_id]
        );
        
        if (!result.rows[0]) {
          console.error(`Course not found for enrollment. Course ID: ${parent.course_id}`);
          throw new Error(`Course with ID ${parent.course_id} not found. This enrollment may reference a deleted course.`);
        }
        
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching course for enrollment:', error);
        throw error;
      }
    },
  },
};

module.exports = enrollmentResolvers;
