import React from 'react';

export default function Button({ value, onClick, disabled = false, normalField }) {
  const buttonStyle = {
    backgroundColor: disabled ? '#D5DBDB' : normalField ? "#E5E7EB" : '#3498DB',
    color: normalField ? '#4B5563' : '#FFFFFF',
    padding: '10px 20px',
    border: normalField ? '1px solid #D1D5DB' : 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
  };

  const hoverStyle = {
    backgroundColor: disabled ? '#D5DBDB' : normalField ? "#ccdee0" : '#2980B9',
    transform: disabled ? 'none' : 'translateY(-2px)',
  };

  const [hover, setHover] = React.useState(false);

  return (
    <button
      style={hover && !disabled ? { ...buttonStyle, ...hoverStyle } : { ...buttonStyle }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      disabled={disabled}
      aria-label={value}
    >
      {value}
      <style>{`
        @media (max-width: 768px) {
          button {
            font-size: 14px !important;
            padding: 8px 16px !important;
          }
        }
      `}</style>
    </button>
  );
}