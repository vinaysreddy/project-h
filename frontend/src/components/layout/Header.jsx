import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm py-3 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-xl">FitSync</Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-[#e72208]">Dashboard</Link>
          <Link to="/nutrition" className="hover:text-[#3E7B27]">Nutrition</Link>
          <Link to="/workout" className="hover:text-[#e72208]">Workouts</Link>
          
          <Link to="/profile" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              {user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <span className="hidden md:inline">Profile</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;