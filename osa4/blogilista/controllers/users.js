const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users.map((user) => user.toJSON()));
});

usersRouter.post('/', async (request, response) => {
  const { password, name, username } = request.body;

  if (password === undefined) {
    const error = new Error('Missing password');
    error.name = 'ValidationError';
    throw error;
  }

  if (password.length < 3) {
    const error = new Error('Invalid password. Minimum length is 3 characters');
    error.name = 'ValidationError';
    throw error;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
