import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email)
    if(emailTaken){
      throw new Error('Email already exists');
    }
    const user = {
      id: uuidv4(),
      ...args.data
    }
    console.log(args, user)
    db.users.push(user);
    return user;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author)
    if(!userExists) {
      throw new Error('User does not exists');
    }
    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.posts.push(post);
    return post;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);
    if(!user) {
      throw new Error('User not found');
    }
    if(typeof data.email === 'string') {
      const emailTaken = db.users.some((user) =>  user.email === data.email);

      if(emailTaken) {
        throw new Error('Email already exists');
      }
      user.email = data.email;
    }
    if(typeof data.name === 'string') {
      user.name = data.name;
    }
    if(typeof data.age != undefined) {
      user.age = data.age;
    }

    return user;
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) =>  post.id === id);
    if(!post) {
      throw new Error('Post does not exits');
    }
    if( typeof data.title === 'string') {
      post.title = data.title;
    }
    if( typeof data.body === 'string') {
      post.body = data.body;
    }
    if( typeof data.published === 'boolean') {
      post.published = data.published;
    }
    return post;
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);
    if(!comment) {
      throw new Error('comment does not exists');
    }
    if(typeof data.text === 'string') {
      comment.text = data.text;
    }
    return comment;
  },
  createComment(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExistsAndPublished = db.posts.some((post) => (post.id === args.data.post && post.published));
    if(!userExists || !postExistsAndPublished) {
      throw new Error('Either User or Post does not exists');
    }
    const comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment);
    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if(userIndex === -1) {
      throw new Error("user not found");
    }
    const deletedUser = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if(match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    })
    db.comments =  db.comments.filter((comment) => comment.author !== args.id);
    return deletedUser[0];
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if(postIndex === -1) {
      throw new Error("post does not exists");
    }
    const deletedPost = posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => comment.post !== args.id);
    return deletedPost[0];
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
    if(commentIndex === -1) {
      throw new Error('Comment does not exists');
    }
    const deletedComment = db.comments.splice(commentIndex, 1);
    return deletedComment[0];
  }
}

export { Mutation as default }