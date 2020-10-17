import React, { useState, useImperativeHandle } from 'react';

const initialBlogState = {
  title: '',
  author: '',
  url: '',
};

const BlogForm = React.forwardRef(({ createBlog }, ref) => {
  const [newBlog, setNewBlog] = useState(initialBlogState);

  const handleChange = (event) => {
    const value = event.target.value;
    setNewBlog({
      ...newBlog,
      [event.target.name]: value,
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    resetBlogForm();
  };

  const resetBlogForm = () => setNewBlog(initialBlogState);

  useImperativeHandle(ref, () => {
    return {
      resetBlogForm,
    };
  });

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
});

BlogForm.displayName = 'BlogForm';


export default BlogForm;
