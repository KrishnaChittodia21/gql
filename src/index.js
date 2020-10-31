import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';
import { Query, Mutation, Post, User, Comment } from './resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Comment,
    User,
    Mutation,
    Post
  },
  context: {
    db
  }
})

server.start(() => {
  console.log('The server is up')
})