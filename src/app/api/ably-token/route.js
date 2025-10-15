import { NextResponse } from 'next/server';
import Ably from 'ably';
import { getEnv } from '@/lib/env';

export async function GET() {
    try {
        console.log('[Ably Token] Generating token request...');
        const env = getEnv();
        const apiKey = env?.ABLY_API_KEY || process.env.ABLY_API_KEY;

        if (!apiKey) {
            console.error('[Ably Token] ABLY_API_KEY not found');
            return NextResponse.json(
                { error: 'ABLY_API_KEY is not configured' },
                { status: 500 }
            );
        }

        console.log('[Ably Token] API Key found, creating REST client...');

        // Create Ably REST client
        const client = new Ably.Rest(apiKey);

        // Generate token for client with appropriate permissions
        const tokenRequest = await client.auth.createTokenRequest({
            clientId: `student-app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            capability: {
                'students': ['subscribe', 'history']
            },
            ttl: 3600000 // 1 hour
        });

        console.log('[Ably Token] ✅ Token request generated successfully');
        console.log('[Ably Token] Client ID:', tokenRequest.clientId);
        console.log('[Ably Token] Capability:', JSON.stringify(tokenRequest.capability));
        console.log('[Ably Token] Key name:', tokenRequest.keyName);

        return NextResponse.json(tokenRequest);
    } catch (error) {
        console.error('[Ably Token] ❌ Error generating token:', error);
        console.error('[Ably Token] Error details:', error.message, error.stack);
        return NextResponse.json(
            { error: 'Failed to generate Ably token', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST() {
    // Also support POST for token requests
    return GET();
}
