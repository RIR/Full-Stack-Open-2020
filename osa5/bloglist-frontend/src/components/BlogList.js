import React from 'react';
import Blog from './Blog';
import Notification from './Notification';

const BlogList = ({ blogs, user, message, handleLogout }) => (
  <div>
    <h2>blogs</h2>
    <Notification message={message} />
    <p>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </p>
    <ul>
      {blogs.map((blog) => (
        <li key={blog.id}>
          <Blog blog={blog} />
        </li>
      ))}
    </ul>
  </div>
);

export default BlogList;
