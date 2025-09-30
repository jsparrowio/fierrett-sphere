import express from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { RequestHandler } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const startApolloServer = async () => {
  try {
    await server.start();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
      '/graphql',
      expressMiddleware(server as any, {
        context: authenticateToken as any,
      }) as unknown as RequestHandler
    );


    if (process.env.NODE_ENV === 'production') {
      console.log('\x1b[1mYour app is running in production mode!');
      const address = path.join(__dirname, '../../client/dist');
      app.use(express.static(address));
      app.get('/*path', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
      });

    } else if (process.env.NODE_ENV === 'development') {
      // Proxy non-GraphQL requests to Vite dev server
      console.log('\x1b[1mDev mode detected! \x1b[0m \nSetting up Vite proxy...');
      app.use(
        /^\/(?!graphql).*$/,
        createProxyMiddleware({
          target: 'http://localhost:5173',
          changeOrigin: true,
        })
      );
    } else {
      console.log('\x1b[1mNo node env set... assuming dev mode... (did you set the node_env .env variable?) \x1b[0m \nSetting up Vite proxy...');
      app.use(
        /^\/(?!graphql).*$/,
        createProxyMiddleware({
          target: 'http://localhost:5173',
          changeOrigin: true,
        })
      );
    }

    db.on('error', console.error.bind(console, '\x1b[31mMongoDB connection error:'));

    app.listen(PORT, () => {
      console.log(`\x1b[1mApollo + Express running on port \x1b[4m${PORT}`);
      if (process.env.NODE_ENV === 'production') {
        console.log('\x1b[1m\x1b[32mYour service is now live! ✅\x1b[0m');
      }
      else {
        console.log('\x1b[1m\x1b[33mYour service is now running in development mode 🚧\x1b[0m');
      }
    });
  } catch (err) {
    console.error('Fatal error during startup:', err);
    process.exit(1);
  }
};

startApolloServer();