// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      style={{
        width: '200px', // Reduced width
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#333',
        padding: '15px', // Reduced padding
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
        overflowY: 'auto',
        transform: isOpen ? 'translateX(0)' : 'translateX(-200px)', // Match width
        transition: 'transform 0.3s ease',
      }}
    >
      <button 
        onClick={onClose} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          fontSize: '20px', // Slightly smaller font size
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      >
        &times;
        <h1 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>Dengue Data App</h1>
      </button>
      <Link to="/add-dengue-data" style={linkStyle}>Add Dengue Data</Link>
      <Link to="/data-list" style={linkStyle}>Data List</Link>
    </div>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'block',
  padding: '8px 12px', // Adjusted padding
  marginBottom: '8px', // Reduced margin
  borderRadius: '4px',
  backgroundColor: '#444',
  transition: 'background-color 0.3s',
};

export default Sidebar;
