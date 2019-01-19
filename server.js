const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const cors = require('cors');

require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Bring in GraphQL-Express Middleware
const { ApolloServer, gql } = require('apollo-server-express');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// Connects database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.error(err));

// Initialize application
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// set up JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);

  if (token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (error) {
      console.log(error);
    }
  }

  next();
});

// Create GraphiQL Application
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ Recipe, User, currentUser: req.currentUser })
});
server.applyMiddleware({
  app,
  path: '/graphql'
});

const PORT = process.env.port || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
