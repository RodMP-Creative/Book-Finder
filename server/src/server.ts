import express, { Application } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema/index.js';
import jwt from 'jsonwebtoken';

const app: Application = express();
const PORT = process.env.PORT || 3001;

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
        } catch (err) {
          console.error('Invalid token');
        }
      }
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes);


  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Server ready http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer();
