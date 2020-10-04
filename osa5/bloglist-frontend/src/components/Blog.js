import React, { useState } from 'react';
const Blog = ({ blog, likeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [displayFull, setDisplayFull] = useState(false);

  const { title, author, url, likes, user } = blog;

  const toggleView = () => setDisplayFull(!displayFull);

  const addLike = (event) => {
    event.preventDefault();
    const updatedBlog = { ...blog, likes: blog.likes += 1 };
    likeBlog(updatedBlog);
  };

  const displayButton = <button onClick={toggleView}>{displayFull ? 'hide' : 'view'}</button>;

  const likeButton = <button onClick={addLike}>like</button>;

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
        </div>
      )}
    </div>
  );
};

export default Blog;
