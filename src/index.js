import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

let users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 27
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

let posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL...',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQL post...',
  published: false,
  author: '1'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: true,
  author: '2'
}]

let comments = [{
  id: '102',
  text: 'This worked well for me. Thanks!',
  author: '3',
  post: '10'
}, {
  id: '103',
  text: 'Glad you enjoyed it.',
  author: '1',
  post: '10'
}, {
  id: '104',
  text: 'This did no work.',
  author: '2',
  post: '11'
}, {
  id: '105',
  text: 'Nevermind. I got it to work.',
  author: '1',
  post: '12'
}]

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
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);
      if(userIndex === -1) {
        throw new Error("user not found");
      }
      const deletedUser = users.splice(userIndex, 1);
      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if(match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !match;
      })
      comments =  comments.filter((comment) => comment.author !== args.id);
      return deletedUser[0];
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);
      if(postIndex === -1) {
        throw new Error("post does not exists");
      }
      const deletedPost = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => comment.post !== args.id);
      return deletedPost[0];
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id);
      if(commentIndex === -1) {
        throw new Error('Comment does not exists');
      }
      const deletedComment = comments.splice(commentIndex, 1);
      return deletedComment[0];
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
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => {
  console.log('The server is up')
})