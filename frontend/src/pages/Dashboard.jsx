import React from 'react';
import DashboardComponent from '../components/dashboard/Dashboard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e72208]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <DashboardComponent formData={user.userData} />;
};

export default Dashboard;