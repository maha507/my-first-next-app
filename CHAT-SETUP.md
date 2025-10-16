# Real-Time Chat Setup Guide

This guide explains the real-time chat feature with typing indicators powered by Ably.

## Features

- 💬 Real-time messaging between multiple users
- ⌨️ Live typing indicators (e.g., "Maha is typing...")
- 🔄 Instant message delivery
- 👥 Multiple user support
- 🎨 Beautiful, modern UI
- ⚡ Powered by Ably Realtime

## How It Works

### Architecture

1. **Chat Page** (`/src/app/chat/page.js`):
   - Username input screen
   - Real-time message display
   - Typing indicator functionality
   - Ably client integration

2. **Ably Token API** (`/src/app/api/ably-token/route.js`):
   - Generates secure tokens for clients
   - Provides chat-room channel permissions
   - Manages authentication

3. **Real-time Communication**:
   - Messages published via `chat-room` channel
   - Typing indicators sent as events
   - Automatic 2-second timeout for typing status

## Setup Instructions

### Step 1: Configure Ably API Key

Make sure you have your Ably API key configured:

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Ably API key:
   ```env
   ABLY_API_KEY=your_ably_api_key_here
   ```

3. Get your API key from [Ably Dashboard](https://ably.com/accounts)

### Step 2: Start the Development Server

```bash
npm run dev
```

### Step 3: Open Multiple Browser Windows

To test the chat and typing indicators:

1. Open `http://localhost:3000/chat` in one browser window
2. Enter a name (e.g., "Maha")
3. Open `http://localhost:3000/chat` in another browser window (or incognito)
4. Enter a different name (e.g., "Ahmed")
5. Start typing in one window - you'll see typing indicators in the other!

## Features Explained

### Typing Indicators

When you type in the chat input:
- Other users see: "Maha is typing..."
- Works for multiple users: "Maha and Ahmed are typing..."
- Automatically stops after 2 seconds of inactivity
- Stops immediately when you send a message

**How it works:**
```javascript
// When user types
sendTypingIndicator(true);

// After 2 seconds of no typing
setTimeout(() => {
    sendTypingIndicator(false);
}, 2000);

// When message is sent
sendTypingIndicator(false);
```

### Real-Time Messages

Messages are delivered instantly to all connected users:
- Each message shows sender name
- Timestamp for each message
- Your messages appear on the right (blue)
- Other users' messages appear on the left (white)

### User Experience

1. **Join Screen**:
   - Enter your name
   - Click "Join Chat"
   - Connects to Ably automatically

2. **Chat Screen**:
   - See all messages in real-time
   - Type and send messages
   - See who's typing
   - Auto-scroll to latest message

## Channels Used

### `chat-room` Channel

**Events:**
- `message` - Chat messages
  ```javascript
  {
    username: "Maha",
    text: "Hello everyone!",
    timestamp: "2025-01-16T10:30:00.000Z"
  }
  ```

- `typing` - Typing indicators
  ```javascript
  {
    username: "Maha",
    isTyping: true
  }
  ```

## Customization

### Change Channel Name

Edit `/src/app/chat/page.js`:
```javascript
chatChannel = client.channels.get('your-channel-name');
```

### Adjust Typing Timeout

Change the timeout duration (default: 2000ms):
```javascript
typingTimeoutRef.current = setTimeout(() => {
    sendTypingIndicator(false);
}, 3000); // 3 seconds
```

### Customize Message Appearance

Edit the message styles in the chat page:
```javascript
style={{
    background: isOwnMessage
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'white',
    color: isOwnMessage ? 'white' : '#333',
}}
```

## Testing

### Test Locally

1. Open two browser windows side by side
2. Use different names in each window
3. Type in one window - see typing indicator in the other
4. Send messages back and forth

### Test with Multiple Users

1. Open the chat in multiple tabs/windows
2. Use different names for each
3. Test with 3+ users to see:
   - "User1 and User2 are typing..."
   - "User1, User2 and 1 others are typing..."

## Troubleshooting

### Typing Indicators Not Showing

1. Check browser console for errors
2. Verify Ably connection: Look for "✅ Connected to Ably"
3. Make sure you're using different usernames
4. Check that ABLY_API_KEY is configured

### Messages Not Sending

1. Check Ably connection status in console
2. Verify API key has publish permissions
3. Check network tab for failed requests
4. Ensure channel name matches in code

### Connection Issues

1. Check `.env.local` has valid ABLY_API_KEY
2. Restart development server
3. Clear browser cache
4. Check Ably dashboard for account status

## Technical Details

### Ably Client Initialization

```javascript
const client = new Realtime({
    authCallback: async (tokenParams, callback) => {
        const res = await fetch('/api/ably-token');
        const data = await res.json();
        callback(null, data);
    },
    clientId: username,
});
```

### Channel Permissions

The token API grants these permissions:
- `subscribe` - Receive messages
- `publish` - Send messages
- `presence` - Track online users (future feature)
- `history` - View message history (future feature)

### Message Flow

```
User types → Input onChange → Send typing indicator (true)
  ↓
2 seconds pass → Timeout fires → Send typing indicator (false)
  ↓
User hits Send → Publish message → Send typing indicator (false)
  ↓
Ably broadcasts → All users receive → Update UI
```

## Future Enhancements

Possible improvements:
- User presence (online/offline status)
- Message history persistence
- Read receipts
- File/image sharing
- User avatars
- Private messaging
- Emoji reactions
- Message search

## Support

For issues with:
- **Ably SDK**: [Ably Documentation](https://ably.com/docs)
- **React Integration**: [Ably React Guide](https://ably.com/docs/quick-start-guide?lang=react)
- **This Implementation**: Check the code comments or create an issue

Enjoy your real-time chat! 💬✨
