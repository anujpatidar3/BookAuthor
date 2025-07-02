import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { config } from './config';
import sequelize from './config/database';
import connectMongoDB from './config/mongodb';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './resolvers';

// Import models to ensure they are registered
import './models/Author';
import './models/Book';

async function startServer() {
  try {
    // Create Express app
    const app = express();
    const httpServer = createServer(app);

    // Trust proxy for production deployment (Render, Railway, etc.)
    if (config.nodeEnv === 'production') {
      app.set('trust proxy', 1);
    }

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: 'Too many requests from this IP, please try again later.',
    });
    app.use('/graphql', limiter);

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      csrfPrevention: {
        requestHeaders: ['x-apollo-operation-name', 'apollo-require-preflight']
      },
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
        };
      },
    });

    // Start Apollo Server
    await server.start();

    // Apply global middleware
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    // Apply GraphQL-specific middleware and endpoint
    app.use('/graphql', cors(config.cors));
    app.use('/graphql', graphqlUploadExpress({ maxFileSize: 5000000, maxFiles: 1 })); // 5MB limit, 1 file
    app.use('/graphql', expressMiddleware(server) as any);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv 
      });
    });

    // Connect to databases
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');

    // Sync database models
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized');
    }

    console.log('Connecting to MongoDB...');
    await connectMongoDB();

    // Start HTTP server
    const PORT = config.port;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    });

  } catch (error: any) {
    console.error('Failed to start: ', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();
