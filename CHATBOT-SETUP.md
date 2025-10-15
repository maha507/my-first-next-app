
# AI Chatbot Setup Guide

This guide will help you set up the AI chatbot feature powered by Cloudflare Workers AI.

## Features

- Real-time AI chat interface
- Powered by Cloudflare Workers AI (Llama 3.1 8B Instruct model)
- No API keys required - uses AI binding
- Free tier with generous limits
- Built-in caching and optimization
- Runs at the edge for low latency

## Setup Instructions

### Step 1: Configure AI Binding

The AI binding is already configured in `wrangler.toml`:

```toml
[ai]
binding = "AI"
```

This gives your application access to Cloudflare's Workers AI models without needing external API keys!

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Local Development

For local development with Workers AI binding, use:

```bash
npx wrangler pages dev .next --compatibility-date=2025-01-01 --binding AI
```

Or for regular Next.js development (note: AI features will only work when deployed):

```bash
npm run dev
```

Visit `http://localhost:3000/chatbot` to test the chatbot!

### Step 4: Deploy to Cloudflare Pages

1. Build your application:
   ```bash
   npm run pages:build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   npm run deploy
   ```

The AI binding will automatically be available in production!

## How It Works

### Architecture

1. **Frontend** (`/src/app/chatbot/page.js`):
   - Modern chat UI with message history
   - Real-time typing indicators
   - Responsive design

2. **Worker File** (`/_worker.js`):
   - Cloudflare Pages Advanced Mode worker
   - Wraps the Next.js application
   - Provides AI binding access to API routes
   - Passes environment bindings to request handlers

3. **API Route** (`/src/app/api/chat/route.js`):
   - Edge runtime for optimal performance
   - Uses Workers AI binding via `request.env.AI`
   - No external API calls needed

4. **Workers AI Integration**:
   - Uses the `@cf/meta/llama-3.1-8b-instruct` model
   - Maintains conversation history
   - Context-aware responses
   - Runs on Cloudflare's global network

### API Endpoints

#### POST /api/chat
Sends a message to the AI and receives a response.

**Request:**
```json
{
  "message": "Your message here",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

**Response:**
```json
{
  "message": "AI response here",
  "model": "@cf/meta/llama-3.1-8b-instruct"
}
```

#### GET /api/chat
Health check endpoint to verify API configuration.

**Response:**
```json
{
  "message": "Chat API is running with Cloudflare Workers AI",
  "status": "healthy",
  "configured": true,
  "model": "@cf/meta/llama-3.1-8b-instruct"
}
```

## Available Models

Cloudflare Workers AI supports multiple models. To change the model, edit `/src/app/api/chat/route.js`:

**Popular Models:**
- `@cf/meta/llama-3.1-8b-instruct` (default) - Fast and efficient
- `@cf/meta/llama-3.1-70b-instruct` - More powerful, slower
- `@cf/mistral/mistral-7b-instruct-v0.1` - Alternative option
- `@cf/qwen/qwen1.5-14b-chat` - Good for various tasks

**Example:**
```javascript
const response = await AI.run('@cf/meta/llama-3.1-70b-instruct', {
    messages: messages,
    temperature: 0.7,
    max_tokens: 512
});
```

See [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/) for the full list.

## Customization

### Adjust AI Behavior

Modify the system message in `/src/app/api/chat/route.js`:

```javascript
{
    role: 'system',
    content: 'You are a helpful AI assistant for a Student Management System...'
}
```

### Change Temperature

Adjust the `temperature` parameter (0.0 to 1.0) for more creative or conservative responses:

```javascript
temperature: 0.7, // Lower = more focused, Higher = more creative
```

### Adjust Response Length

Modify `max_tokens` to control response length:

```javascript
max_tokens: 512, // Increase for longer responses
```

## Troubleshooting

### "AI binding not configured" Error

- Make sure `wrangler.toml` has the `[ai]` binding configuration
- For local development, use `wrangler pages dev` with the `--binding AI` flag
- Restart your development server after configuration changes

### AI Features Don't Work Locally

- Workers AI binding requires Cloudflare's environment
- Use `wrangler pages dev` for local testing with AI features
- Alternatively, deploy to Cloudflare Pages for full functionality

### Model Response Issues

- Try adjusting the `temperature` parameter
- Increase `max_tokens` if responses are cut off
- Consider using a different model for better results

## Cost Management

### Workers AI Pricing

- **Free Tier**: 10,000 Neurons per day (generous for development and small apps)
- **Paid Plans**: Pay only for what you use beyond free tier
- No API keys or external services required
- Check [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) for details

### Benefits over External APIs

- **No API Keys**: No need to manage external API credentials
- **Built-in Caching**: Cloudflare automatically optimizes requests
- **Edge Computing**: Low latency worldwide
- **Generous Free Tier**: Great for development and small projects

## Security Best Practices

1. Never commit `.env.local` to version control
2. Implement rate limiting on the frontend
3. Consider adding authentication to the chat endpoint
4. Monitor AI usage in Cloudflare dashboard
5. Set up proper error handling

## Next Steps

- Add user authentication to the chat
- Implement conversation persistence
- Add chat history storage with D1 database
- Create admin dashboard for monitoring
- Implement streaming responses for better UX
- Try different AI models for various use cases

## Support

For issues with:
- **Workers AI**: [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- **Cloudflare Pages**: [Pages Documentation](https://developers.cloudflare.com/pages/)
- **Next.js on Pages**: [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
- **This Implementation**: Check the code comments or create an issue

Enjoy your AI-powered chatbot running on Cloudflare's edge network!
