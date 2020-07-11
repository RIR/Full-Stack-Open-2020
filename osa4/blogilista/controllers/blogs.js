const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  // TODO
  // For now, add the first user in db as the adder.
  const users = await User.find({});
  const firstUser = users[0];

  const blog = new Blog({ title, author, url, likes, user: firstUser._id });
  const savedBlog = await blog.save();

  // Update user info here as well
  firstUser.blogs = firstUser.blogs.concat(savedBlog._id);
  await firstUser.save();

  response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const modifiedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
  response.status(200).json(modifiedBlog.toJSON());
});

module.exports = blogsRouter;
