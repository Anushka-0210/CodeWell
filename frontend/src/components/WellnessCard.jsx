import React from 'react';

const WellnessCard = ({ message }) => {
  return (
    <div className={`message-item ${message.type}`}>
      <div className="message-icon">{message.icon}</div>
      <div className="message-content">
        <div className="message-title">{message.title}</div>
        <div className="message-text">{message.text}</div>
      </div>
    </div>
  );
};

export default WellnessCard;
