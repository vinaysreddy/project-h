import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add other routes as needed */}
        </Routes>
    </AuthProvider>
  );
}

export default App;