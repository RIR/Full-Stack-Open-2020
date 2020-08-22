import React, { useState } from 'react';
const BlogForm = ({ addBlog, newBlog, handleChange }) => {
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input type='text' value={newBlog.title} name='title' onChange={handleChange} />
        </div>
        <div>
          author
          <input type='author' value={newBlog.author} name='author' onChange={handleChange} />
        </div>
        <div>
          url
          <input type='url' value={newBlog.url} name='url' onChange={handleChange} />
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
