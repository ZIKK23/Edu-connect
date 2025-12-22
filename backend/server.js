const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const { readFileSync } = require('fs');
const { join } = require('path');
const expressPlayground = require('graphql-playground-middleware-express').default;
require('dotenv').config({ path: join(__dirname, '..', '.env') });

const resolvers = require('./graphql/resolvers');
const { studentsPool, coursesPool } = require('./db');

// Read GraphQL schema
const typeDefs = readFileSync(
  join(__dirname, 'graphql', 'schema.graphql'),
  'utf-8'
);

const app = express();
const PORT = process.env.GRAPHQL_PORT || 4000;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  },
  introspection: true, // Enable GraphQL Playground in development
});

// Start server
async function startServer() {
  await server.start();

  // Middleware with CORS for Apollo Sandbox
  app.use(
    '/graphql',
    cors({
      origin: [
        'http://localhost:5000',
        'https://studio.apollographql.com',
        '*'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS']
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        // Add both database pools to context
        studentsDb: studentsPool,
        coursesDb: coursesPool,
      }),
    })
  );

  // GraphQL Playground UI (moved to separate route to avoid conflict)
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'EduConnect GraphQL API is running' });
  });

  app.listen(PORT, () => {
    console.log('🚀 EduConnect GraphQL Server is running!');
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await studentsPool.end();
  await coursesPool.end();
  process.exit(0);
});

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
