import { NextResponse } from 'next/server';
import { publishStudentNotification } from '@/lib/ably';

export async function GET() {
    try {
        console.log('[Test Ably] Sending test notification...');

        const testStudent = {
            id: 'TEST123',
            firstName: 'Test',
            lastName: 'Notification',
            studentId: 'TEST001',
            profileImage: '🔔'
        };

        await publishStudentNotification('student.created', testStudent);

        return NextResponse.json({
            success: true,
            message: 'Test notification sent! Check your browser for the notification.'
        });
    } catch (error) {
        console.error('[Test Ably] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
