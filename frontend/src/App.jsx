import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
/* import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import WorkoutPlan from './pages/WorkoutPlan';
import NutritionPlan from './pages/NutritionPlan';
import SleepAnalysis from './pages/SleepAnalysis';
import Profile from './pages/Profile';
import Settings from './pages/Settings'; */

// Import layout components
/* import Header from './components/layout/Header';
import Footer from './components/layout/Footer'; */

function App() {
  return (
    <div className="App">
      {/* <Header /> */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workout" element={<WorkoutPlan />} />
          <Route path="/nutrition" element={<NutritionPlan />} />
          <Route path="/sleep" element={<SleepAnalysis />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;