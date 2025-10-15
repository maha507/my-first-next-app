import { NextResponse } from 'next/server';
import { publishStudentNotification } from '@/lib/ably';
import * as dbMemory from '@/lib/db-memory';
import { use } from 'react';

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const student = await dbMemory.getStudentById(id);

        if (!student) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        return NextResponse.json(
            { error: 'Failed to fetch student' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        console.log('[API] PUT /api/students/[id] - Updating student');
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await request.json();
        console.log('[API] Updating student ID:', id, 'Data:', body);

        const updatedStudentData = await dbMemory.updateStudent(id, body);

        if (!updatedStudentData) {
            console.log('[API] Student not found:', id);
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        console.log('[API] Student updated:', updatedStudentData);

        // Send Ably notification
        console.log('[API] Sending Ably notification for student.updated');
        await publishStudentNotification('student.updated', updatedStudentData);
        console.log('[API] Ably notification sent successfully');

        return NextResponse.json(updatedStudentData);
    } catch (error) {
        console.error('[API] Error updating student:', error);
        return NextResponse.json(
            { error: 'Failed to update student' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        console.log('[API] DELETE /api/students/[id] - Deleting student');
        const resolvedParams = await params;
        const { id } = resolvedParams;
        console.log('[API] Deleting student ID:', id);

        // Get student data from request body (sent by client)
        const body = await request.json().catch(() => null);
        const studentData = body || { id, name: 'Student' };
        console.log('[API] Student data for notification:', studentData);

        // Send Ably notification (data comes from client)
        console.log('[API] Sending Ably notification for student.deleted');
        await publishStudentNotification('student.deleted', studentData);
        console.log('[API] Ably notification sent successfully');

        return NextResponse.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('[API] Error deleting student:', error);
        return NextResponse.json(
            { error: 'Failed to delete student' },
            { status: 500 }
        );
    }
}