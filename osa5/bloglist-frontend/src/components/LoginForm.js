import React from 'react';
import Notification from './Notification';

const LoginForm = ({ handleLogin, username, password, setUsername, setPassword, message }) => (
  <div>
    <h2>Log in to application</h2>
    <Notification message={message} />
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>
);

export default LoginForm;
