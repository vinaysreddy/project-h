import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from '@/components/home/Home.jsx';

function App() {
  return (
    <div className="App">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;