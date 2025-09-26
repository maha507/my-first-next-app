import { NextResponse } from 'next/server';

// This would typically come from your database
let students = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        studentId: 'STU001',
        phone: '+1 234-567-8900',
        dateOfBirth: '2000-05-15',
        course: 'Computer Science',
        year: '3rd Year',
        gpa: '3.8',
        address: '123 Main St, City, State',
        profileImage: '/images/default-avatar.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        studentId: 'STU002',
        phone: '+1 234-567-8901',
        dateOfBirth: '1999-08-22',
        course: 'Business Administration',
        year: '2nd Year',
        gpa: '3.9',
        address: '456 Oak Ave, City, State',
        profileImage: '/images/default-avatar.jpg',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
    }
];

export async function GET(request, { params }) {
    const { id } = params;
    const student = students.find(s => s.id === id);

    if (!student) {
        return NextResponse.json(
            { error: 'Student not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(student);
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        const studentIndex = students.findIndex(s => s.id === id);

        if (studentIndex === -1) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        students[studentIndex] = {
            ...students[studentIndex],
            ...body,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json(students[studentIndex]);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update student' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    const studentIndex = students.findIndex(s => s.id === id);

    if (studentIndex === -1) {
        return NextResponse.json(
            { error: 'Student not found' },
            { status: 404 }
        );
    }

    students.splice(studentIndex, 1);

    return NextResponse.json({ message: 'Student deleted successfully' });
}