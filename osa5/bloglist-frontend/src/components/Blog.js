import React, { useState } from 'react';
const Blog = ({ blog, like, remove, user: currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const { title, author, url, likes, user = { username: 'random' } } = blog;

  const [displayFull, setDisplayFull] = useState(false);

  const toggleView = () => setDisplayFull(!displayFull);

  const likeBlog = (event) => {
    const updatedBlog = { ...blog, likes: (blog.likes += 1) };
    like(updatedBlog);
  };

  const removeBlog = (event) => {
    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      remove(blog);
    }
  };

  const displayButton = <button onClick={toggleView}>{displayFull ? 'hide' : 'view'}</button>;

  const likeButton = <button onClick={likeBlog}>like</button>;

  const removeButton = (
    <button style={{ background: '#34c0eb' }} onClick={removeBlog}>
      remove
    </button>
  );

  return (
    <div style={blogStyle}>
      <div>
        {title} {author} {displayButton}
      </div>
      {displayFull && (
        <div>
          <p>{url}</p>
          <p>
            {likes} {likeButton}
          </p>
          <p>{user && user.username}</p>
          {currentUser.username === user.username && removeButton}
          {removeButton}
        </div>
      )}
    </div>
  );
};

export default Blog;
