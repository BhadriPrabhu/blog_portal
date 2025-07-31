import React from 'react';

export default function Button({ value, onClick }) {
  const buttonStyle = {
    backgroundColor: '#f5e9e9',
    color: '#4a2c2c',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const hoverStyle = {
    backgroundColor: '#e0c7c7',
  };

  const [hover, setHover] = React.useState(false);

  return (
    <button
      style={hover ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {value}
    </button>
  );
}