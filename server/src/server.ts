import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import path from 'path';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set up express server and apollo server
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// starts apollo server when called
const startApolloServer = async () => {
  await server.start();

  // use express middleware to set up express server
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // set up graphql to make test queries
  app.use('/graphql', expressMiddleware(server as any
    , {
      context: authenticateToken as any
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    console.log('\x1b[1mYour app is running in production mode!');
    const address = path.join(__dirname, '../../client/dist');
    app.use(express.static(address));
    app.get('/*path', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  } else if (process.env.NODE_ENV === 'development') {
    // Proxy non-GraphQL requests to Vite dev server
    console.log('\x1b[1mDev mode detected! \x1b[0m');
  } else {
    console.log('\x1b[1mNo node env set... assuming dev mode... (did you set the node_env .env variable?)\x1b[0m');
  }

  db.on('error', console.error.bind(console, '\x1b[31mMongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`\x1b[1mApollo + Express running on port \x1b[4m${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('\x1b[1m\x1b[32mYour service is now live! ✅\x1b[0m\n');
    }
    else {
      console.log('\x1b[1m\x1b[33mYour service is now running in development mode 🚧\n\x1b[1m\x1b[33mBe sure to check the Vite logs to see where to access your app...\x1b[0m');
    }
  });
};

startApolloServer();