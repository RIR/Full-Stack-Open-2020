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
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    blogFormRef.current.resetBlogForm();
  };

  const createBlog = (blogObject) => {
    togglableRef.current.toggleVisibility();

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        displayMessage({
          type: 'success',
          content: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        });
      })
      .catch((error) => displayMessage({ type: 'error', content: 'Adding failed' }));
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
          <BlogList blogs={blogs} user={user} message={message} handleLogout={handleLogout} />
          <Togglable buttonLabel='new note' ref={togglableRef}>
            <BlogForm createBlog={createBlog} ref={blogFormRef} />
          </Togglable>
        </div>
      )}
    </div>
  );
};

export default App;
