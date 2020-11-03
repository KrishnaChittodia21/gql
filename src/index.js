import { GraphQLServer, PubSub } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { Query, Mutation, Post, User, Comment, Subscription } from './resolvers';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Comment,
    User,
    Mutation,
    Post,
    Subscription
  },
  context: {
    db,
    pubsub
  }
})

server.start(() => {
  console.log('The server is up')
})