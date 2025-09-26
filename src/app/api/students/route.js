import { NextResponse } from 'next/server';

// In-memory storage for demo (in production, use a database)
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

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let filteredStudents = students;

    if (search) {
        const lowercaseSearch = search.toLowerCase();
        filteredStudents = students.filter(student =>
            student.firstName.toLowerCase().includes(lowercaseSearch) ||
            student.lastName.toLowerCase().includes(lowercaseSearch) ||
            student.email.toLowerCase().includes(lowercaseSearch) ||
            student.studentId.toLowerCase().includes(lowercaseSearch)
        );
    }

    return NextResponse.json(filteredStudents);
}

export async function POST(request) {
    try {
        const body = await request.json();

        const newStudent = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        students.push(newStudent);

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create student' },
            { status: 500 }
        );
    }
}