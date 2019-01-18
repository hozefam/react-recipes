const express = require('express');
const mongoose = require('mongoose');

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

// Create GraphiQL Application
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ Recipe, User })
});
server.applyMiddleware({
  app,
  path: '/graphql'
});

const PORT = process.env.port || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
