import React, { useState, useEffect, useRef } from 'react';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const togglableRef = useRef();
  const blogFormRef = useRef();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const fetchBlogs = async () => {
    const blogsFromService = await blogService.getAll();
    setBlogs(blogsFromService);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));

      setUser(user);
      setUsername('');
      setPassword('');

      displayMessage({ type: 'success', content: `user ${user.username} logged in` });
    } catch (exception) {
      displayMessage({ type: 'error', content: 'wrong username or password' });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    blogFormRef.current.resetBlogForm();
  };

  const createBlog = async (blogObject) => {
    togglableRef.current.toggleVisibility();

    try {
      const createdBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(createdBlog));
      displayMessage({
        type: 'success',
        content: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      });
    } catch (error) {
      displayMessage({ type: 'error', content: 'Adding failed' });
    }
  };

  const likeBlog = async (blogObject) => {
    try {
      const likedBlog = await blogService.update(blogObject);

      setBlogs(blogs.map((blog) => (blog.id === likedBlog.id ? likedBlog : blog)));
      displayMessage({
        type: 'success',
        content: `Blog ${likedBlog.title} was liked`,
      });
    } catch (error) {
      displayMessage({ type: 'error', content: 'liking failed' });
    }
  };

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject);
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));

      displayMessage({
        type: 'success',
        content: `Blog ${blogObject.title} was removed`,
      });
    } catch (error) {
      displayMessage({ type: 'error', content: 'Removing failed' });
    }
  };

  // Helper function for setting and clearing the message, which Notification component can use.
  const displayMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div>
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          message={message}
        />
      ) : (
        <div>
          <BlogList
            blogs={blogs}
            user={user}
            message={message}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
            handleLogout={handleLogout}
          />
          <Togglable buttonLabel='new blog' ref={togglableRef}>
            <BlogForm createBlog={createBlog} ref={blogFormRef} />
          </Togglable>
        </div>
      )}
    </div>
  );
};

export default App;
