const Query = {
  users(parent, args, { db }, info) {
    if(!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    })
  },
  posts(parent, args, { db }, info) {
    if(!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
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
  comments(parents, args, { db }, info) {
    return db.comments;
  }
}

export { Query as default};