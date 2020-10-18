import { GraphQLServer } from 'graphql-yoga';

const users = [{
  id: 1,
  name: 'k1',
  email: 'k1@k1.com',
  age: 21
},
{
  id: 2,
  name: 'k2',
  email: 'k2@k2.com'
},
{
  id: 3,
  name: 'k3',
  email: 'k3@k3.com',
}]

const posts = [
  {
    id: '1',
    title: 'first post',
    body: 'test body',
    published: false,
    author: 1
  },
  {
    id: '2',
    title: 'second post',
    body: 'test body',
    published: false,
    author: 1,
  },
  {
    id: '3',
    title: 'third post',
    body: 'test body',
    published: false,
    author: 2
  }
]

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if(!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
    posts(parent, args, ctx, info) {
      if(!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
        return isBodyMatch || isTitleMatch;
      })
    },
    me() {
      return {
        id: '1234',
        name: 'kannu21',
        email: 'kannu21@kannu21.com',
        age: 28
      }
    },
    post() {
      return {
        id: '1',
        title: 'first post',
        body: 'test body',
        published: false
      }
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up')
})