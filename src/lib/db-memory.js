// In-memory database fallback for development
// This is used when D1 database is not available

let students = [];

/**
 * Get all students with optional search filtering
 */
export async function getStudents(searchQuery = null) {
    if (!searchQuery) {
        return students;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    return students.filter(student =>
        student.firstName?.toLowerCase().includes(lowercaseQuery) ||
        student.lastName?.toLowerCase().includes(lowercaseQuery) ||
        student.email?.toLowerCase().includes(lowercaseQuery) ||
        student.studentId?.toLowerCase().includes(lowercaseQuery) ||
        student.course?.toLowerCase().includes(lowercaseQuery)
    );
}

/**
 * Get a single student by ID
 */
export async function getStudentById(id) {
    return students.find(student => student.id === id) || null;
}

/**
 * Create a new student
 */
export async function createStudent(studentData) {
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const newStudent = {
        id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email || '',
        studentId: studentData.studentId,
        phone: studentData.phone || '',
        dateOfBirth: studentData.dateOfBirth || '',
        course: studentData.course || '',
        year: studentData.year || '',
        gpa: studentData.gpa || '',
        address: studentData.address || '',
        profileImage: studentData.profileImage || '🧑‍🎓',
        createdAt: now,
        updatedAt: now
    };

    students.push(newStudent);
    return newStudent;
}

/**
 * Update an existing student
 */
export async function updateStudent(id, studentData) {
    const index = students.findIndex(student => student.id === id);

    if (index === -1) {
        return null;
    }

    const now = new Date().toISOString();
    students[index] = {
        ...students[index],
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email || '',
        studentId: studentData.studentId,
        phone: studentData.phone || '',
        dateOfBirth: studentData.dateOfBirth || '',
        course: studentData.course || '',
        year: studentData.year || '',
        gpa: studentData.gpa || '',
        address: studentData.address || '',
        profileImage: studentData.profileImage || students[index].profileImage,
        updatedAt: now
    };

    return students[index];
}

/**
 * Delete a student
 */
export async function deleteStudent(id) {
    const student = students.find(s => s.id === id);

    if (!student) {
        return null;
    }

    students = students.filter(s => s.id !== id);
    return student;
}

/**
 * Initialize with data (optional)
 */
export function initializeData(initialData) {
    students = initialData;
}
