# Chat Typing Indicator Troubleshooting Guide

## Problem: Typing Indicators Not Showing

If you're not seeing "Maha is typing..." when someone types, follow these debugging steps:

### Step 1: Check Browser Console

Open browser Developer Tools (F12) and look for these messages:

#### When Joining Chat:
```
[Chat] Fetching Ably token...
[Chat] Token received, initializing client...
[Chat] ✅ Connected to Ably
[Chat] ✅ Ably initialized successfully
```

#### When Typing:
**In Window 1 (where you're typing):**
```
[Chat] Sending typing indicator: Maha true
[Chat] Sending typing indicator: Maha false  (after 2 seconds)
```

**In Window 2 (where you should see the indicator):**
```
[Chat] Typing indicator received: Maha true Current user: Ahmed
[Chat] Adding to typing list: Maha
[Chat] Removing from typing list: Maha  (after 2 seconds)
```

### Step 2: Common Issues

#### Issue 1: ABLY_API_KEY Not Configured

**Symptoms:**
- Error in console: "ABLY_API_KEY is not configured"
- Can't join chat

**Solution:**
1. Create/edit `.env.local` file
2. Add: `ABLY_API_KEY=your_key_here`
3. Restart server: `npm run dev`

#### Issue 2: Using Same Username

**Symptoms:**
- No typing indicator appears
- Console shows: "Ignoring own typing indicator"

**Solution:**
- Use DIFFERENT usernames in each window
- Window 1: "Maha"
- Window 2: "Ahmed"

#### Issue 3: Not Opening Multiple Windows

**Symptoms:**
- Can't see typing indicators

**Solution:**
You need at least 2 browser windows/tabs:
1. Open `http://localhost:3000/chat` in Window 1
2. Open `http://localhost:3000/chat` in Window 2 (or incognito mode)
3. Use different usernames
4. Type in one window, watch the other

#### Issue 4: Channel Not Connected

**Symptoms:**
- Console shows: "Cannot send typing indicator - channel: false"

**Solution:**
- Wait for "Connected to Ably" message
- Refresh the page
- Check Ably API key is valid

### Step 3: Testing Procedure

Follow this exact procedure:

#### Window 1:
1. Go to `http://localhost:3000/chat`
2. Enter name: **Maha**
3. Click "Join Chat"
4. Wait for console message: "✅ Connected to Ably"
5. **Keep this window open, don't type yet**

#### Window 2 (New Window or Incognito):
1. Go to `http://localhost:3000/chat`
2. Enter name: **Ahmed** (DIFFERENT name!)
3. Click "Join Chat"
4. Wait for console message: "✅ Connected to Ably"

#### Test Typing:
1. Click in Window 1's message input
2. Start typing: "Hello"
3. **Look at Window 2** - You should see:
   ```
   Maha is typing...
   ```
4. Wait 2 seconds without typing
5. The typing indicator should disappear

#### Test Reverse:
1. Now type in Window 2
2. **Look at Window 1** - You should see:
   ```
   Ahmed is typing...
   ```

### Step 4: Debug Console Logs

Enable verbose logging by checking the browser console for these exact messages:

**Good Signs (Everything Working):**
```javascript
[Chat] Fetching Ably token...
[Chat] Token received, initializing client...
[Chat] ✅ Connected to Ably
[Chat] ✅ Ably initialized successfully
[Chat] Sending typing indicator: Maha true
[Chat] Typing indicator received: Maha true Current user: Ahmed
[Chat] Adding to typing list: Maha
```

**Bad Signs (Something Wrong):**
```javascript
// No Ably connection
[Chat] ❌ Connection failed: [error]

// Can't send typing
[Chat] Cannot send typing indicator - channel: false username: true

// Token error
Failed to get Ably token
```

### Step 5: Verify Ably Token Permissions

Test the token API:

```bash
curl http://localhost:3000/api/ably-token | jq .
```

Should return:
```json
{
  "capability": {
    "students": ["subscribe", "history"],
    "chat-room": ["subscribe", "publish", "presence", "history"]
  },
  "clientId": "student-app-...",
  ...
}
```

Make sure `chat-room` has all these permissions:
- ✅ subscribe
- ✅ publish
- ✅ presence
- ✅ history

### Step 6: Check Ably Dashboard

1. Go to [Ably Dashboard](https://ably.com/accounts)
2. Check "Live Stats"
3. When you open chat, you should see:
   - Connections: 2 (when 2 windows open)
   - Messages: Increasing when typing
   - Channels: `chat-room`

### Step 7: Network Tab

Check browser DevTools > Network tab:

1. Look for request to `/api/ably-token`
   - Should return 200 OK
   - Should have JSON with tokenRequest

2. Look for WebSocket connections to Ably
   - Should show "101 Switching Protocols"
   - Status: Active

### Step 8: Still Not Working?

Try these steps:

1. **Clear browser cache**
   ```
   Ctrl+Shift+Delete
   Clear cache
   Reload page
   ```

2. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check .env.local file**
   ```bash
   cat .env.local
   # Should show ABLY_API_KEY=...
   ```

4. **Verify Ably package**
   ```bash
   npm list ably
   # Should show: ably@2.14.0
   ```

5. **Reinstall dependencies**
   ```bash
   rm -rf node_modules
   npm install
   ```

### Step 9: Test with 3 Users

Advanced test with 3 users:

1. Window 1: Username "Maha"
2. Window 2: Username "Ahmed"
3. Window 3: Username "Sarah"

When Maha and Ahmed both type:
```
Maha and Ahmed are typing...
```

When all 3 type:
```
Maha, Ahmed and 1 others are typing...
```

### Expected Behavior

✅ **Correct:**
- Typing shows in OTHER windows only
- Shows after 1 keystroke
- Hides after 2 seconds of no typing
- Hides immediately when message sent
- Shows multiple users typing

❌ **Incorrect:**
- Seeing your own typing indicator
- Delay more than 1 second
- Indicator stuck on screen
- Not showing other users

### Quick Checklist

Before asking for help, verify:

- [ ] Two different browser windows open
- [ ] Two different usernames used
- [ ] Both show "✅ Connected to Ably"
- [ ] ABLY_API_KEY in .env.local
- [ ] Server restarted after adding key
- [ ] Browser console open (F12)
- [ ] No errors in console
- [ ] Typing in one window
- [ ] Looking at OTHER window for indicator

### Get Help

If still not working, provide:
1. Browser console logs (all [Chat] messages)
2. Network tab screenshot
3. .env.local file (hide the actual key!)
4. Steps you followed
5. Exact behavior you're seeing

## Success!

When working correctly, you should see typing indicators appear smoothly and disappear automatically. The chat should feel responsive and real-time!
