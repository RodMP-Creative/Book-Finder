import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import initializeDb from './config/connection.js';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schema/index.js';
import routes from './routes/index.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const context = async ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1] || '';
  let user = null;

  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET_KEY || '';
      user = jwt.verify(token, secretKey);
    } catch (err) {
      console.error('Token verification failed:', err);
    }
  }

  return { user };
};

const startApolloServer = async () => {
  await server.start();
  await initializeDb();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server as any, { context }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.use(routes);

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
