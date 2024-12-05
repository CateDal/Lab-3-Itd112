// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddDengueData from './components/AddDengueData';
import DengueDataList from './components/DengueDataList';
import CsvUploader from './components/CsvUploader';
import GeoMap from './components/GeoMap'; // Import the GeoMap component
import Sidebar from './components/Sidebar';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <div style={{ flex: 1 }}>
          <button
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              top: '10px',
              left: '10px',
              zIndex: 1000,
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? 'Close' : 'Open'}
          </button>

          <div
            style={{
              marginLeft: sidebarOpen ? '250px' : '0',
              transition: 'margin-left 0.3s ease',
              padding: '20px',
            }}
          >
            <Routes>
              <Route path="/add-dengue-data" element={<AddDengueData />} />
              <Route path="/data-list" element={<DengueDataList />} />
              <Route path="/csv-uploader" element={<CsvUploader />} />
              <Route path="/geo-map" element={<GeoMap />} /> {/* New route for GeoMap */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
