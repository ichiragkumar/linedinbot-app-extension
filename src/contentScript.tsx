import { createRoot } from 'react-dom/client';
import BookmarkNotification from './components/BookmarkNotification';
import { detectBookmarkActions } from './utils/linkedinDetector';

// Create a container for our React app
const container = document.createElement('div');
container.id = 'linkedin-bookmark-extension-root';
document.body.appendChild(container);

// Mount React component
const root = createRoot(container);
root.render(<BookmarkNotification />);

// Initialize bookmark detection
detectBookmarkActions();