import React from 'react';
import Blog from './Blog';
import Notification from './Notification';

const BlogList = ({ blogs, user, message, likeBlog, handleLogout }) => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Blog blog={blog} likeBlog={likeBlog} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
