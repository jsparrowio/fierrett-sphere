import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import type { RequestHandler } from 'express';

import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => authenticateToken(req),
    }) as unknown as RequestHandler
  );

  if (process.env.NODE_ENV === 'production') {
    const address = path.join(__dirname, '../../client/dist');
    app.use(express.static(address));

    // app.get('*', (_req, res) => {
    //   res.sendFile(path.join(address, 'index.html'));
    // });
  } else {
    // Proxy non-GraphQL requests to Vite dev server
    app.use(
      '/',
      createProxyMiddleware({
        target: 'http://localhost:5173',
        changeOrigin: true,
      })
    );
    console.log('Proxying frontend to Vite dev server at http://localhost:5173');
  }

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`Apollo + Express running on port \x1b[1m${PORT}`);
    console.log('\x1b[1m\x1b[32mYour service is now live! ✅\x1b[0m');
  });
};

startApolloServer();