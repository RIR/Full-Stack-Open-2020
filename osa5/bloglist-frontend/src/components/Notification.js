import React from 'react';
require('../App.css');


const Notification = ({ message }) => (message === null ? null : <div className={message.type}>{message.content}</div>);

export default Notification;
