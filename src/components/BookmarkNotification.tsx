import React, { useEffect, useState } from 'react';

const BookmarkNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Listen for bookmark events from the content script
    const handleBookmarkDetected = (_event: CustomEvent) => {
      setMessage('LinkedIn post bookmarked and synced to Discord!');
      setIsVisible(true);
      
      // Hide after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };
    
    // Create custom event listener
    window.addEventListener('bookmarkDetected', handleBookmarkDetected as EventListener);
    
    return () => {
      window.removeEventListener('bookmarkDetected', handleBookmarkDetected as EventListener);
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#0a66c2', // LinkedIn blue
        color: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 9999,
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
      }}
    >
      {message}
    </div>
  );
};

export default BookmarkNotification;