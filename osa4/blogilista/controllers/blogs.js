const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({ title, author, url, likes, user: user._id });
  const savedBlog = await blog.save();

  // Update user info here as well
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

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
