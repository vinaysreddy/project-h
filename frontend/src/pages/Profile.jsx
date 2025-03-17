import React from 'react';
import { signOut } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
            ) : (
              <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="truncate">{user.uid}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Health Information</h3>
            {user.userData ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p>{user.userData.height} {user.userData.heightUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p>{user.userData.weight} {user.userData.weightUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p>{user.userData.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Primary Goal</p>
                  <p>{user.userData.primaryGoal?.replace(/^.*?\s/, '')}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No health data available</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2">
            Edit Profile
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;