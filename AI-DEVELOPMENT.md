# AI Development Guide

## Understanding the 500 Error in Local Development

When running `npm run dev`, you'll see a **500 Internal Server Error** when trying to use the chatbot. This is **expected behavior** and here's why:

### Why This Happens

The AI binding (`env.AI`) is **only available** in Cloudflare's environment:
- ✅ Deployed on Cloudflare Pages (production)
- ✅ Running with `wrangler pages dev` (local Cloudflare environment)
- ❌ Running with `npm run dev` (standard Next.js dev server)

### The Error You're Seeing

```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Error: Error: Failed to get response
```

This happens because:
1. Your Next.js dev server (`npm run dev`) doesn't have access to Cloudflare bindings
2. The `request.env.AI` is `undefined`
3. The API returns a 503 error with a helpful message
4. The frontend displays the error

## Solutions

### Option 1: Test with Cloudflare Environment (Recommended)

Run the app with Workers AI binding available:

```bash
# Build the Pages-compatible version
npm run pages:build

# Run with Cloudflare environment (AI binding available)
npm run dev:ai
```

This command:
1. Builds your Next.js app for Cloudflare Pages
2. Starts `wrangler pages dev` with AI binding
3. Makes the chatbot fully functional locally

### Option 2: Deploy to Cloudflare Pages

Deploy your app to test in production:

```bash
# Build and deploy
npm run pages:build
npm run deploy
```

The AI binding will automatically work in production!

### Option 3: Continue Local Dev (No AI)

If you're working on other features (students CRUD, UI, etc.):

```bash
# Standard Next.js development
npm run dev
```

The chatbot won't work, but you'll see a helpful error message explaining why.

## Development Workflow

### For UI/Frontend Development
```bash
npm run dev
```
- Fast hot reload
- Work on UI, layouts, navigation
- AI features will show helpful error message

### For AI Testing
```bash
npm run dev:ai
```
- Test chatbot functionality
- Requires build step (slower feedback)
- Full Workers AI access

### For Production
```bash
npm run pages:build
npm run deploy
```
- Deploy to Cloudflare Pages
- Full functionality with AI binding

## Error Messages Explained

### In Browser Console
```
Failed to load resource: the server responded with a status of 500
```
- **Cause**: AI binding not available
- **Fix**: Use `npm run dev:ai` or deploy

### In Chatbot UI
```
⚠️ AI features are not available in local development mode.

To test the chatbot:
1. Build: npm run pages:build
2. Run locally: npx wrangler pages dev .next-deploy --compatibility-date=2025-01-01 --binding AI

Or deploy to Cloudflare Pages for full functionality.
```
- **Cause**: Running with `npm run dev`
- **Fix**: Use `npm run dev:ai` or deploy

### API Health Check
```bash
curl http://localhost:3000/api/chat
```

**With npm run dev:**
```json
{
  "message": "Chat API is running but AI binding is not available (local dev mode)",
  "status": "healthy",
  "configured": false,
  "model": "@cf/meta/llama-3.1-8b-instruct",
  "environment": "development",
  "hint": "Use wrangler pages dev or deploy to Cloudflare Pages to enable AI features"
}
```

**With npm run dev:ai or production:**
```json
{
  "message": "Chat API is running with Cloudflare Workers AI",
  "status": "healthy",
  "configured": true,
  "model": "@cf/meta/llama-3.1-8b-instruct",
  "environment": "production"
}
```

## Quick Reference

| Command | AI Works? | Hot Reload? | Use Case |
|---------|-----------|-------------|----------|
| `npm run dev` | ❌ No | ✅ Yes | UI development |
| `npm run dev:ai` | ✅ Yes | ❌ No | AI testing locally |
| Deploy to Pages | ✅ Yes | N/A | Production |

## Troubleshooting

### "AI binding not available" after running dev:ai

1. Make sure you ran the build first:
   ```bash
   npm run pages:build
   ```

2. Check that wrangler is using the correct directory:
   ```bash
   wrangler pages dev .next-deploy --compatibility-date=2025-01-01 --binding AI
   ```

3. Verify `wrangler.toml` has the AI binding:
   ```toml
   [ai]
   binding = "AI"
   ```

### Build Errors

If `npm run pages:build` fails:

1. Clean and reinstall:
   ```bash
   rm -rf .next .next-deploy node_modules
   npm install
   npm run pages:build
   ```

2. Check for Next.js compatibility issues in the console

### Worker Not Loading

If the `_worker.js` isn't working:

1. Ensure it's in the project root
2. Check that it's not in `.gitignore`
3. Rebuild with `npm run pages:build`

## Summary

The 500 error is **not a bug** - it's the expected behavior when AI binding isn't available. Choose the right development mode for what you're working on:

- 🎨 **UI/Layout**: `npm run dev`
- 🤖 **AI Features**: `npm run dev:ai`
- 🚀 **Production**: Deploy to Cloudflare Pages

Need help? Check [CHATBOT-SETUP.md](./CHATBOT-SETUP.md) for more details!
