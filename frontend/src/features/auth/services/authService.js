const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Authenticates a user with the backend using Firebase ID token
 * @param {string} token - Firebase ID token
 * @param {object} userData - User data to send to backend
 * @returns {Promise<object>} - Response from backend
 */
export const authenticateUser = async (token, userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Authentication failed: ${response.statusText || errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Authentication service error:', error);
    throw error;
  }
};

/**
 * Saves user basic details to the backend
 * @param {string} token - Firebase ID token
 * @param {object} userData - User basic details
 * @returns {Promise<object>} - Response from backend
 */
export const saveUserBasicDetails = async (token, userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/basic-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to save user details: ${response.statusText || errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Save user details service error:', error);
    throw error;
  }
};

/**
 * Gets user basic details from the backend
 * @param {string} token - Firebase ID token
 * @returns {Promise<object>} - Response from backend with user details
 */
export const getUserBasicDetails = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/basic-details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get user details: ${response.statusText || errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get user details service error:', error);
    throw error;
  }
};