const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

describe('In blogs API', () => {
  let token;
  let user;
  beforeAll(async () => {
    await User.deleteMany({});
    const userResponse = await api.post('/api/users').send(helper.initialUser);
    user = userResponse.body;

    const loginResponse = await api
      .post('/api/login')
      .send({ username: helper.initialUser.username, password: helper.initialUser.password });

    token = `bearer ${loginResponse.body.token}`;
  });

  beforeEach(async () => {
    const initialBlogs = helper.initialBlogs.map((blog) => ({ ...blog, user: user.id }));
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  describe('using GET', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('there are two blogs', async () => {
      const response = await api.get('/api/blogs');
      expect(response.body.length).toBe(helper.initialBlogs.length);
    });

    test('there is an id property defined', async () => {
      const response = await api.get('/api/blogs');
      response.body.map((blog) => expect(blog.id).toBeDefined());
    });
  });

  describe('using POST', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'R.R',
        url: 'https://foo.bar/',
        likes: 1,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const allBlogs = await helper.blogsInDb();
      const titles = allBlogs.map((r) => r.title);

      expect(allBlogs.length).toBe(helper.initialBlogs.length + 1);
      expect(titles).toContain(newBlog.title);
    });

    test('a valid blog can not be added if token is missing', async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'R.R',
        url: 'https://foo.bar/',
        likes: 1,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    });

    test("if likes property is not given it's value will be set to 0 ", async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'R.R',
        url: 'https://foo.bar/',
      };

      const response = await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toBe(0);
    });

    test('New blog entry must contain value for title', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      };

      await api.post('/api/blogs').set('Authorization', token).send(newBlog).expect(400);
    });

    test('New blog entry must contain value for url', async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      };

      await api.post('/api/blogs').set('Authorization', token).send(newBlog).expect(400);
    });
  });

  describe('using PUT ', () => {
    test('Existing  blog can be modified', async () => {
      const response = await api.get('/api/blogs');
      const firstBlog = response.body[0];
      const { id, title, author, url, likes } = firstBlog;
      expect(likes).toBe(7);

      const modifiedBlog = { title, author, url, likes: 10 };
      const putResponse = await api
        .put(`/api/blogs/${id}`)
        .send(modifiedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(putResponse.body.likes).toBe(10);
    });
  });

  describe('using DELETE', () => {
    test('Existing  blog can be removed by giving an id in request', async () => {
      const response = await api.get('/api/blogs');
      expect(response.body.length).toBe(2);

      const firstBlog = response.body[0];
      await api.delete(`/api/blogs/${firstBlog.id}`).set('Authorization', token).expect(204);

      const responseAfterDelete = await api.get('/api/blogs');

      expect(responseAfterDelete.body.length).toBe(1);
      expect(responseAfterDelete.body.map((blog) => blog.id !== firstBlog.id));
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
