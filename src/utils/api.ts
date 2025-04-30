import axios from 'axios';
import { BookmarkData } from '../types';

// Get API URL from extension settings or use default
const getApiUrl = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiUrl'], (result) => {
      resolve(result.apiUrl || 'http://localhost:3000/api/bookmarks');
    });
  });
};

// Get user ID from extension settings
const getUserId = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['userId'], (result) => {
      resolve(result.userId || 'default-user');
    });
  });
};

export const sendBookmarkToAPI = async (bookmarkData: BookmarkData) => {
  const apiUrl = await getApiUrl();
  const userId = await getUserId();
  
  return axios.post(apiUrl, {
    userId,
    linkedinUrl: bookmarkData.url,
    title: bookmarkData.title,
    description: bookmarkData.description,
    thumbnailUrl: bookmarkData.thumbnailUrl
  });
};

export const testApiConnection = async (): Promise<boolean> => {
  try {
    const apiUrl = await getApiUrl();
    
    // Try a few different approaches to test the connection
    try {
      // First try: ping the base URL
      const baseUrl = apiUrl.substring(0, apiUrl.lastIndexOf('/'));
      await axios.get(baseUrl);
      return true;
    } catch (firstError) {
      console.log('First connection attempt failed, trying OPTIONS request', firstError);
      
      // Second try: try an OPTIONS request which might work even with CORS
      await axios.options(apiUrl);
      return true;
    }
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};
