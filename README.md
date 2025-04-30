# LinkedIn Bookmark to Discord Chrome Extension

This Chrome extension automatically detects when you bookmark content on LinkedIn and sends it to your Discord channel via the API.

## Features

- Automatically detects LinkedIn bookmark actions
- Sends bookmark data to your configured API
- Displays recent bookmarks in the extension popup
- Configurable API endpoint and user ID

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Chrome browser

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the extension:
   ```
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked" and select the `dist` folder from this project

### Configuration

1. Click on the extension icon in your Chrome toolbar
2. Configure the API URL (default: `http://localhost:3000/api/bookmarks`)
3. Set your user ID
4. Save settings

## Development

Run the development server with hot module replacement:

```
npm run dev
```

This will watch for file changes and rebuild the extension.

## Backend API

This extension works with the LinkedIn to Discord Bot API. Make sure your server is running and accessible at the configured API URL.

## Usage

1. Browse LinkedIn as normal
2. When you bookmark content, the extension will automatically detect the action
3. Bookmark data will be sent to your API and a notification will appear
4. View recent bookmarks in the extension popup

