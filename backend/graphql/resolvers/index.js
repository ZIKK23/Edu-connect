// Main resolver file 
const studentResolvers = require('./studentResolvers');
const courseResolvers = require('./courseResolvers');
const enrollmentResolvers = require('./enrollmentResolvers');

const resolvers = {
  Query: {
    ...studentResolvers.Query,
    ...courseResolvers.Query,
    ...enrollmentResolvers.Query,
  },
  Mutation: {
    ...studentResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...enrollmentResolvers.Mutation,
  },
  Enrollment: enrollmentResolvers.Enrollment,
};

module.exports = resolvers;
