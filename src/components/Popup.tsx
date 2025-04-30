import React, { useEffect, useState } from 'react';
import { Settings } from '../types';
import { testApiConnection } from '../utils/api';

const Popup: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    apiUrl: 'http://localhost:3000/api/bookmarks',
    userId: 'default-user',
    discordEnabled: true
  });
  
  const [status, setStatus] = useState<{
    message: string;
    isError: boolean;
  }>({ message: 'Loading...', isError: false });
  
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  
  // Function to test the API connection
  const checkApiConnection = async () => {
    setIsTesting(true);
    setStatus({ message: 'Testing connection...', isError: false });
    
    try {
      const isConnected = await testApiConnection();
      if (isConnected) {
        setStatus({ message: 'Connected to API ✓', isError: false });
      } else {
        setStatus({ message: 'Cannot connect to API. Server may be down or URL is incorrect.', isError: true });
      }
    } catch (error) {
      setStatus({ message: 'API connection error. Check console for details.', isError: true });
    } finally {
      setIsTesting(false);
    }
  };
  
  // Load settings on component mount
  useEffect(() => {
    chrome.storage.sync.get(['apiUrl', 'userId', 'discordEnabled'], (result) => {
      setSettings({
        apiUrl: result.apiUrl || settings.apiUrl,
        userId: result.userId || settings.userId,
        discordEnabled: result.discordEnabled !== undefined ? result.discordEnabled : settings.discordEnabled
      });
    });
    
    // Load recent bookmarks
    chrome.storage.local.get(['bookmarks'], (result) => {
      if (result.bookmarks && Array.isArray(result.bookmarks)) {
        // Get the 5 most recent bookmarks
        setBookmarks(result.bookmarks.slice(-5).reverse());
      }
    });
    
    // Initial API connection test
    checkApiConnection();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSettings({
      ...settings,
      [name]: newValue
    });
  };
  
  const handleSave = () => {
    chrome.storage.sync.set(settings, () => {
      setStatus({ message: 'Settings saved!', isError: false });
      
      // Test connection with new settings
      setTimeout(() => {
        checkApiConnection();
      }, 500);
    });
  };
  
  // Function to manually test the connection
  const handleTestConnection = () => {
    checkApiConnection();
  };
  
  return (
    <div style={{ width: '350px', padding: '15px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ margin: '0 0 15px', color: '#0a66c2' }}>LinkedIn Bookmark Sync</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          padding: '8px 12px', 
          backgroundColor: status.isError ? '#ffebee' : '#e8f5e9',
          color: status.isError ? '#c62828' : '#2e7d32',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {status.message}
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          API URL:
        </label>
        <input
          type="text"
          name="apiUrl"
          value={settings.apiUrl}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            padding: '8px', 
            boxSizing: 'border-box',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          User ID:
        </label>
        <input
          type="text"
          name="userId"
          value={settings.userId}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            padding: '8px', 
            boxSizing: 'border-box',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="discordEnabled"
            checked={settings.discordEnabled}
            onChange={handleChange}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontWeight: 'bold' }}>Enable Discord Sync</span>
        </label>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#0a66c2',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save Settings
        </button>
        
        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          style={{
            backgroundColor: isTesting ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: isTesting ? 'default' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      {bookmarks.length > 0 && (
        <div>
          <h3 style={{ margin: '15px 0 10px', fontSize: '16px' }}>Recent Bookmarks</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {bookmarks.map((bookmark, index) => (
              <li key={index} style={{ 
                padding: '8px 0',
                borderBottom: index < bookmarks.length - 1 ? '1px solid #eee' : 'none',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{bookmark.title}</div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '12px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}>
                  {bookmark.url}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Popup;