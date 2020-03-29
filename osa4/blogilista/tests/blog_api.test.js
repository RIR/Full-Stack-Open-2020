const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

describe('In blogs API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
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
      response.body.map(blog => expect(blog.id).toBeDefined());
    });
  });

  describe('using POST', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'R.R',
        url: 'https://foo.bar/',
        likes: 1
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const allBlogs = await helper.blogsInDb();
      const titles = allBlogs.map(r => r.title);

      expect(allBlogs.length).toBe(helper.initialBlogs.length + 1);
      expect(titles).toContain(newBlog.title);
    });

    test("if likes property is not given it's value will be set to 0 ", async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'R.R',
        url: 'https://foo.bar/'
      };

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toBe(0);
    });

    test('New blog entry must contain value for title', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    });

    test('New blog entry must contain value for url', async () => {
      const newBlog = {
        title: 'New Blog Entry',
        author: 'Edsger W. Dijkstra',
        likes: 5
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
