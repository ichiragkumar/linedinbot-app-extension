import { BookmarkData } from './types';
import { sendBookmarkToAPI } from './utils/api';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'BOOKMARK_DETECTED') {
    const bookmarkData: BookmarkData = message.data;
    
    // Store locally in chrome storage
    chrome.storage.local.get(['bookmarks'], (result) => {
      const bookmarks = result.bookmarks || [];
      bookmarks.push({
        ...bookmarkData,
        timestamp: new Date().toISOString()
      });
      
      chrome.storage.local.set({ bookmarks }, () => {
        console.log('Bookmark saved to storage');
      });
    });
    
    // Send to API
    sendBookmarkToAPI(bookmarkData)
      .then((response) => {
        console.log('Bookmark sent to API:', response);
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error('Error sending to API:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep the message channel open for async response
  }
});

// Watch for LinkedIn tab activity
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('linkedin.com')) {
    chrome.tabs.sendMessage(tabId, { 
      type: 'TAB_UPDATED',
      url: tab.url
    });
  }
});