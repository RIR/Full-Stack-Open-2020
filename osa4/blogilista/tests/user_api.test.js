const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const helper = require('./test_helper');

fdescribe('In User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send(helper.initialUser);
  });

  describe('using POST', () => {
    test('user with missing username cant be added ', async () => {
      const newUser = {
        password: 'good enough',
        name: 'random',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({ error: 'User validation failed: username: Path `username` is required.' });
    });

    test('user with invalid username cant be added ', async () => {
      const newUser = {
        password: 'good enough',
        name: 'random',
        username: 'aa',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        error: `User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`,
      });
    });

    test('user with non-unique username cant be added ', async () => {
      const newUser = {
        password: 'good enough',
        name: 'random',
        username: 'initial',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        error: `User validation failed: username: Error, expected \`username\` to be unique. Value: \`${newUser.username}\``,
      });
    });

    test('user with missing password cant be added ', async () => {
      const newUser = {
        name: 'random',
        username: 'random',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        error: 'Missing password',
      });
    });

    test('user with invalid password cant be added ', async () => {
      const newUser = {
        password: 'aa',
        name: 'random',
        username: 'random',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        error: 'Invalid password. Minimum length is 3 characters',
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
