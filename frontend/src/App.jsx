import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import context providers
import { AuthProvider } from './context/AuthContext';

// Import components
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/layout/Header';

// Import pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* Add more routes as you implement them */}
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;