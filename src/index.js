import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

const comments = [
  {
    id: 21,
    text: 'Hello A',
    author: 1,
    post: '1'
  },
  {
    id: 22,
    text: 'Hello B',
    author: 1,
    post: '2'
  },
  {
    id: 23,
    text: 'Hello C',
    author: 2,
    post: '1'
  },
  {
    id: 24,
    text: 'Hello D',
    author: 2,
    post: '3'
  }
]

const users = [{
  id: '1',
  name: 'k1',
  email: 'k1@k1.com',
  age: 21
},
{
  id: '2',
  name: 'k2',
  email: 'k2@k2.com'
},
{
  id: '3',
  name: 'k3',
  email: 'k3@k3.com',
}]

const posts = [
  {
    id: '1',
    title: 'first post',
    body: 'test body',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'second post',
    body: 'test body',
    published: false,
    author: '1',
  },
  {
    id: '3',
    title: 'third post',
    body: 'test body',
    published: true,
    author: '2'
  }
]

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comments!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comments!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comments!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comments!]!
  }

  type Comments {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    },
    comments(parents, args, ctx, info) {
      return comments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email)
      if(emailTaken){
        throw new Error('Email already exists');
      }
      const user = {
        id: uuidv4(),
        ...args.data
      }
      console.log(args, user)
      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)
      if(!userExists) {
        throw new Error('User does not exists');
      }
      const post = {
        id: uuidv4(),
        ...args.data
      }
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExistsAndPublished = posts.some((post) => (post.id === args.data.post && post.published));
      if(!userExists || !postExistsAndPublished) {
        throw new Error('Either User or Post does not exists');
      }
      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment);
      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comments: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      })
    },
    post(parent, args, ctx, info) {
      return  posts.find((post) => {
        return post.id === parent.post;
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