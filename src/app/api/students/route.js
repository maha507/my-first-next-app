import { NextResponse } from 'next/server';
import { publishStudentNotification } from '@/lib/ably';
import * as dbMemory from '@/lib/db-memory';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        const students = await dbMemory.getStudents(search);

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        console.log('[API] POST /api/students - Creating student');
        const body = await request.json();
        console.log('[API] Student data received:', body);

        const newStudent = await dbMemory.createStudent(body);
        console.log('[API] Student created in memory:', newStudent);

        // Send Ably notification
        console.log('[API] Sending Ably notification for student.created');
        await publishStudentNotification('student.created', newStudent);
        console.log('[API] Ably notification sent successfully');

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        console.error('[API] Error creating student:', error);
        return NextResponse.json(
            { error: 'Failed to create student' },
            { status: 500 }
        );
    }
}