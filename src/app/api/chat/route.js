import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
    try {
        const { message, history } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Get AI binding from the environment
        const AI = request.env?.AI || process.env.AI;

        if (!AI) {
            // Provide helpful error message for local development
            return NextResponse.json(
                {
                    error: 'AI binding not available in local development mode',
                    message: 'To test the chatbot:\n\n1. Build: npm run pages:build\n2. Run locally: npx wrangler pages dev .next-deploy --compatibility-date=2025-01-01 --binding AI\n\nOr deploy to Cloudflare Pages for full functionality.',
                    hint: 'Workers AI binding only works with Cloudflare Pages environment'
                },
                { status: 503 }
            );
        }

        // Format chat history for Workers AI
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant for a Student Management System. You help users with questions about students, education, and general queries.'
            }
        ];

        // Add conversation history
        if (history && history.length > 0) {
            history.forEach(msg => {
                messages.push({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                });
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        try {
            // Use Workers AI with the binding
            // Available models: @cf/meta/llama-3.1-8b-instruct, @cf/mistral/mistral-7b-instruct-v0.1, etc.
            const response = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
                messages: messages,
                temperature: 0.7,
                max_tokens: 512
            });

            // Extract the response text
            const responseText = response.response || response.result?.response || response.text || 'No response generated';

            return NextResponse.json({
                message: responseText,
                model: '@cf/meta/llama-3.1-8b-instruct'
            });
        } catch (aiError) {
            console.error('Workers AI Error:', aiError);

            return NextResponse.json(
                {
                    error: 'AI model execution failed',
                    details: aiError.message,
                    hint: 'Check that the AI binding is properly configured in wrangler.toml'
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Chat API Error:', error);

        return NextResponse.json(
            { error: 'Failed to process chat message', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    const AI = request.env?.AI || process.env.AI;
    const isConfigured = !!AI;

    return NextResponse.json(
        {
            message: isConfigured
                ? 'Chat API is running with Cloudflare Workers AI'
                : 'Chat API is running but AI binding is not available (local dev mode)',
            status: 'healthy',
            configured: isConfigured,
            model: '@cf/meta/llama-3.1-8b-instruct',
            environment: process.env.NODE_ENV || 'development',
            hint: !isConfigured ? 'Use wrangler pages dev or deploy to Cloudflare Pages to enable AI features' : undefined
        },
        { status: 200 }
    );
}
