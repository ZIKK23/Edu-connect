import { gql } from '@apollo/client';

// Student Queries
export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      name
      email
      createdAt
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      name
      email
      createdAt
    }
  }
`;

// Course Queries
export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      credits
      lecturer
      createdAt
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      credits
      lecturer
      createdAt
    }
  }
`;

// Enrollment Queries
export const GET_ENROLLMENTS = gql`
  query GetEnrollments {
    enrollments {
      id
      student {
        id
        name
        email
      }
      course {
        id
        title
        credits
      }
      grade
      createdAt
    }
  }
`;

export const GET_ENROLLMENT = gql`
  query GetEnrollment($id: ID!) {
    enrollment(id: $id) {
      id
      student {
        id
        name
        email
      }
      course {
        id
        title
        credits
      }
      grade
      createdAt
    }
  }
`;

// Integration Query
export const GET_STUDENT_COURSES = gql`
  query GetStudentCourses($studentId: ID!) {
    studentCourses(studentId: $studentId) {
      student {
        id
        name
        email
      }
      courses {
        title
        credits
        grade
      }
    }
  }
`;
