// import { useState } from 'react';

// export default function SearchBar() {
//   const [query, setQuery] = useState('');

//   const containerStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     border: '1px solid #E5E7EB', // Tailwind gray-200
//     borderRadius: '9999px',
//     padding: '8px 10px',
//     // width: '100%',
//     maxwidth: "100px",
//     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
//     transition: 'border-color 0.2s ease',
//   };

//   const inputStyle = {
//     border: 'none',
//     outline: 'none',
//     background: 'transparent',
//     flex: 1,
//     fontSize: '15px',
//     color: '#111827', // Tailwind gray-900
//   };

//   const iconStyle = {
//     width: '18px',
//     height: '18px',
//     marginRight: '10px',
//     stroke: '#6B7280', // Tailwind gray-500
//     flexShrink: 0,
//   };

//   return (
//     <div style={containerStyle}>
//       <svg
//         style={iconStyle}
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth="3"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
//         />
//       </svg>
//       <input
//         type="text"
//         placeholder="Search..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         style={inputStyle}
//       />
//     </div>
//   );
// }

import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <Search size={18} color="#6B7280" style={{ marginRight: '8px' }} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by title or tag..."
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          fontSize: '14px',
          fontFamily: 'Poppins, sans-serif',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}