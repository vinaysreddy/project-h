import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://project-h-ulkh.onrender.com');
/**
 * Sends a chat message to the AI coach
 * @param {Object} data - Message data including userData and healthMetrics
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response from the AI coach
 */
export const sendChatMessage = async (data, token) => {
  try {
    
    
    const response = await axios.post(`${API_URL}/coach/chat`, data, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    
    return response.data;
  } catch (error) {
    console.error('Error communicating with AI coach:', error);
    handleApiError(error, 'Failed to get response from coach');
  }
};

/**
 * Retrieves chat history for the user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Chat history data
 */
export const getChatHistory = async (token) => {
  try {
    
    
    const response = await axios.get(`${API_URL}/coach/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    
    return response.data;
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    handleApiError(error, 'Failed to load chat history');
  }
};

/**
 * Common error handling function
 */
const handleApiError = (error, defaultMessage) => {
  let errorMessage = defaultMessage;
  
  if (error.response) {
    errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
    console.error('Error details:', error.response.data);
  } else if (error.request) {
    errorMessage = 'No response from server. Please check your connection.';
  }
  
  throw new Error(errorMessage);
};