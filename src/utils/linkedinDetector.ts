import { BookmarkData } from '../types';

// Function to observe DOM changes and detect bookmark actions
export const detectBookmarkActions = () => {
  // Set up a MutationObserver to watch for bookmark button clicks
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // Look for bookmark notifications that indicate a successful bookmark
        const bookmarkNotifications = document.querySelectorAll('.artdeco-toast-item__message');
        bookmarkNotifications.forEach((notification) => {
          const text = notification.textContent?.toLowerCase() || '';
          if (text.includes('saved') || text.includes('bookmark')) {
            // Extract bookmark data from current page
            const bookmarkData = extractBookmarkData();
            if (bookmarkData) {
              // Send message to background script
              chrome.runtime.sendMessage({
                type: 'BOOKMARK_DETECTED',
                data: bookmarkData
              });
            }
          }
        });
        
        // Also check for clicks on actual bookmark buttons
        const bookmarkButtons = document.querySelectorAll('[aria-label*="bookmark"], [aria-label*="save"]');
        bookmarkButtons.forEach(button => {
          button.addEventListener('click', () => {
            // Give LinkedIn a moment to update UI after click
            setTimeout(() => {
              const bookmarkData = extractBookmarkData();
              if (bookmarkData) {
                chrome.runtime.sendMessage({
                  type: 'BOOKMARK_DETECTED',
                  data: bookmarkData
                });
              }
            }, 500);
          });
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TAB_UPDATED') {
      // Recheck for bookmark buttons when page updates
      setTimeout(() => {
        const bookmarkData = extractBookmarkData();
        if (bookmarkData) {
          // Check if this URL is already bookmarked
          chrome.storage.local.get(['bookmarks'], (result) => {
            const bookmarks = result.bookmarks || [];
            const isAlreadyBookmarked = bookmarks.some(
              (bookmark: any) => bookmark.url === bookmarkData.url
            );
            
            if (isAlreadyBookmarked) {
              console.log('URL already bookmarked, not sending again');
            }
          });
        }
      }, 1000);
    }
  });
};

// Function to extract bookmark data from the current page
const extractBookmarkData = (): BookmarkData | null => {
  try {
    // Get page URL
    const url = window.location.href;
    
    // Get page title
    let title = document.title.replace(' | LinkedIn', '');
    
    // Try to get a more specific title
    const specificTitle = document.querySelector('h1')?.textContent?.trim() || '';
    if (specificTitle) {
      title = specificTitle;
    }
    
    // Try to get description
    let description = '';
    // For posts
    const postContent = document.querySelector('.feed-shared-update-v2__description')?.textContent?.trim();
    // For articles
    const articleContent = document.querySelector('.article-content__body')?.textContent?.trim();
    // For job listings
    const jobContent = document.querySelector('.show-more-less-html__markup')?.textContent?.trim();
    
    description = postContent || articleContent || jobContent || '';
    
    // Truncate description if it's too long
    if (description.length > 300) {
      description = description.substring(0, 297) + '...';
    }
    
    // Try to get thumbnail image
    let thumbnailUrl = '';
    const image = document.querySelector('img.share-image') || 
                  document.querySelector('.entity-image') ||
                  document.querySelector('.feed-shared-article__image-link img');
    
    if (image && 'src' in image) {
      thumbnailUrl = (image as HTMLImageElement).src;
    }
    
    return {
      url,
      title,
      description,
      thumbnailUrl
    };
  } catch (error) {
    console.error('Error extracting bookmark data:', error);
    return null;
  }
};