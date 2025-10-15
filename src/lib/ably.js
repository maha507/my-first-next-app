import Ably from 'ably';
import { getEnv } from './env';

// Initialize Ably REST client for server-side operations
let ablyRestClient = null;
let ablyRealtimeClient = null;

function getAblyRestClient() {
    if (!ablyRestClient) {
        console.log('[Ably] Initializing REST client...');
        const env = getEnv();
        console.log('[Ably] Env from getEnv():', env ? 'found' : 'null');

        const apiKey = env?.ABLY_API_KEY || process.env.ABLY_API_KEY;
        console.log('[Ably] API Key found:', apiKey ? 'YES' : 'NO');
        console.log('[Ably] API Key source:', env?.ABLY_API_KEY ? 'env.ABLY_API_KEY' : 'process.env.ABLY_API_KEY');

        if (!apiKey) {
            console.error('[Ably] ❌ ABLY_API_KEY is not configured');
            console.error('[Ably] process.env keys:', Object.keys(process.env).filter(k => k.includes('ABLY')));
            return null;
        }

        console.log('[Ably] Creating REST client with API key:', apiKey.substring(0, 10) + '...');
        ablyRestClient = new Ably.Rest(apiKey);
        console.log('[Ably] ✅ REST client created successfully');
    }

    return ablyRestClient;
}

function getAblyRealtimeClient() {
    if (!ablyRealtimeClient) {
        const env = getEnv();
        const apiKey = env?.ABLY_API_KEY || process.env.ABLY_API_KEY;

        if (!apiKey) {
            console.error('ABLY_API_KEY is not configured');
            return null;
        }

        ablyRealtimeClient = new Ably.Realtime(apiKey);
    }

    return ablyRealtimeClient;
}

// Publish a notification to Ably (client will handle browser notifications)
export async function publishStudentNotification(action, studentData) {
    try {
        console.log('[Ably Server] Publishing notification:', action);
        console.log('[Ably Server] Student data:', studentData);

        const client = getAblyRestClient();

        if (!client) {
            console.warn('[Ably Server] ⚠️ Client not initialized. Skipping notification.');
            return;
        }

        const channel = client.channels.get('students');
        console.log('[Ably Server] Got channel: students');

        // Create notification message with proper structure
        const notificationMessage = {
            action,
            student: studentData,
            timestamp: new Date().toISOString()
        };

        console.log('[Ably Server] Publishing message to channel "students":', notificationMessage);

        // Publish message with event name 'student-update' and data as payload
        await channel.publish('student-update', notificationMessage);

        console.log(`[Ably Server] ✅ Notification sent successfully: ${action}`, studentData.id || studentData.studentId);
        console.log('[Ably Server] Message published with event name: student-update');
    } catch (error) {
        console.error('[Ably Server] ❌ Failed to publish notification:', error);
        console.error('[Ably Server] Error details:', error.message, error.code);
        if (error.statusCode) {
            console.error('[Ably Server] Status code:', error.statusCode);
        }
        // Don't throw error to prevent breaking the main operation
    }
}

// Helper function to generate notification content
function getNotificationContent(action, studentData) {
    const studentName = studentData.name || 'Student';

    switch (action) {
        case 'student.created':
            return {
                title: 'New Student Added',
                body: `${studentName} has been added to the system.`
            };
        case 'student.updated':
            return {
                title: 'Student Updated',
                body: `${studentName}'s information has been updated.`
            };
        case 'student.deleted':
            return {
                title: 'Student Removed',
                body: `${studentName} has been removed from the system.`
            };
        default:
            return {
                title: 'Student Notification',
                body: `A change occurred for ${studentName}.`
            };
    }
}

// Export Realtime client for client-side subscriptions
export { getAblyRealtimeClient };
