const _ = require('lodash');

const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = blogs => {
  if (blogs.length === 0) return undefined;

  const favoriteBlog = blogs.reduce((prev, current) => (prev.likes > current.likes ? prev : current), 0);
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  };
};

const mostBlogs = blogs => {
  if (blogs.length === 0) return undefined;

  const [author, blogCount] = _(blogs)
    .countBy('author')
    .entries()
    .maxBy(_.last);

  return { author, blogs: blogCount };
};

const mostLikes = blogs => {
  if (blogs.length === 0) return undefined;

  // Chaining used in mostBlogs function is easier to read, but reduce didn't play together with entries for some
  // reason when using it so I implemented it this way, since didn't want to spend more time with
  const countObj = _.reduce(
    blogs,
    (likesObject, blog) => {
      likesObject[blog.author] = likesObject[blog.author] + blog.likes || blog.likes;
      return likesObject;
    },
    {}
  );

  const [author, likes] = _.maxBy(_.entries(countObj), _.last);

  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
