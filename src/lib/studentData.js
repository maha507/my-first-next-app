// Default students data (will be used as initial data if localStorage is empty)
const defaultStudentsData = [
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
        profileImage: '👨‍💻',
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
        profileImage: '👩‍💼',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
    },
    {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@email.com',
        studentId: 'STU003',
        phone: '+1 234-567-8902',
        dateOfBirth: '2001-03-10',
        course: 'Engineering',
        year: '2nd Year',
        gpa: '3.7',
        address: '789 Pine Rd, City, State',
        profileImage: '👨‍🔧',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z'
    },
    {
        id: '4',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@email.com',
        studentId: 'STU004',
        phone: '+1 234-567-8903',
        dateOfBirth: '2000-12-05',
        course: 'Medicine',
        year: '4th Year',
        gpa: '3.9',
        address: '321 Oak Lane, City, State',
        profileImage: '👩‍⚕️',
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-04T00:00:00Z'
    },
    {
        id: '5',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@email.com',
        studentId: 'STU005',
        phone: '+1 234-567-8904',
        dateOfBirth: '1999-09-18',
        course: 'Arts',
        year: '3rd Year',
        gpa: '3.6',
        address: '654 Maple Ave, City, State',
        profileImage: '👨‍🎨',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z'
    },
    {
        id: '6',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        studentId: 'STU006',
        phone: '+1 234-567-8905',
        dateOfBirth: '2001-07-23',
        course: 'Science',
        year: '1st Year',
        gpa: '3.8',
        address: '987 Cedar St, City, State',
        profileImage: '👩‍🔬',
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-06T00:00:00Z'
    }
];

// LocalStorage management class
export class StudentStorage {
    static STORAGE_KEY = 'student_management_data';

    // Initialize localStorage with default data if empty
    static initializeStorage() {
        if (typeof window === 'undefined') return;

        const existingData = localStorage.getItem(this.STORAGE_KEY);
        if (!existingData) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultStudentsData));
        }
    }

    // Get all students from localStorage
    static getAllStudents() {
        if (typeof window === 'undefined') return defaultStudentsData;

        this.initializeStorage();
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : defaultStudentsData;
    }

    // Get student by ID
    static getStudentById(id) {
        const students = this.getAllStudents();
        return students.find(student => student.id === id);
    }

    // Add new student
    static async addStudent(studentData) {
        console.log('[StudentStorage] Adding student...', studentData);

        // First update localStorage for immediate UI update
        const students = this.getAllStudents();
        const newStudent = {
            ...studentData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        students.push(newStudent);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
        console.log('[StudentStorage] LocalStorage updated with new student:', newStudent.id);

        // Then notify via API (which triggers Ably notification)
        try {
            console.log('[StudentStorage] Calling POST /api/students...');
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });

            console.log('[StudentStorage] API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.warn('[StudentStorage] API call failed:', response.status, errorText);
            } else {
                const result = await response.json();
                console.log('[StudentStorage] ✅ API call successful:', result);
            }
        } catch (error) {
            console.error('[StudentStorage] ❌ Error calling API:', error);
            // Local storage already updated, so operation still succeeds
        }

        return newStudent;
    }

    // Update existing student
    static async updateStudent(id, updatedData) {
        console.log('[StudentStorage] Updating student:', id, updatedData);

        // First update localStorage for immediate UI update
        const students = this.getAllStudents();
        const index = students.findIndex(student => student.id === id);

        if (index === -1) {
            console.error('[StudentStorage] Student not found:', id);
            return null;
        }

        const updatedStudent = {
            ...students[index],
            ...updatedData,
            updatedAt: new Date().toISOString()
        };
        students[index] = updatedStudent;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
        console.log('[StudentStorage] LocalStorage updated for student:', id);

        // Then notify via API (which triggers Ably notification)
        try {
            console.log('[StudentStorage] Calling PUT /api/students/' + id);
            const response = await fetch(`/api/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
            });

            console.log('[StudentStorage] API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.warn('[StudentStorage] API call failed:', response.status, errorText);
            } else {
                const result = await response.json();
                console.log('[StudentStorage] ✅ API call successful:', result);
            }
        } catch (error) {
            console.error('[StudentStorage] ❌ Error calling API:', error);
            // Local storage already updated, so operation still succeeds
        }

        return updatedStudent;
    }

    // Delete student
    static async deleteStudent(id) {
        // Get student before deleting for notification
        const students = this.getAllStudents();
        const studentToDelete = students.find(s => s.id === id);

        if (!studentToDelete) {
            return false;
        }

        // First update localStorage for immediate UI update
        const filteredStudents = students.filter(student => student.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredStudents));

        // Then notify via API (which triggers Ably notification)
        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentToDelete),
            });

            if (!response.ok) {
                console.warn('API call failed, but local storage updated');
            }
        } catch (error) {
            console.error('Error calling API:', error);
            // Local storage already updated, so operation still succeeds
        }

        return true;
    }

    // Search students
    static searchStudents(query) {
        const students = this.getAllStudents();
        if (!query) return students;

        const lowercaseQuery = query.toLowerCase();
        return students.filter(student =>
            student.firstName.toLowerCase().includes(lowercaseQuery) ||
            student.lastName.toLowerCase().includes(lowercaseQuery) ||
            student.email.toLowerCase().includes(lowercaseQuery) ||
            student.studentId.toLowerCase().includes(lowercaseQuery) ||
            student.course.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Generate next student ID
    static generateStudentId() {
        const students = this.getAllStudents();
        const maxId = Math.max(...students.map(s => parseInt(s.studentId.replace('STU', ''))), 0);
        return `STU${String(maxId + 1).padStart(3, '0')}`;
    }
}

// Emoji options for different courses
export const courseEmojis = {
    'Computer Science': ['👨‍💻', '👩‍💻', '🧑‍💻'],
    'Business Administration': ['👨‍💼', '👩‍💼', '🧑‍💼'],
    'Engineering': ['👨‍🔧', '👩‍🔧', '🧑‍🔧'],
    'Medicine': ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'],
    'Arts': ['👨‍🎨', '👩‍🎨', '🧑‍🎨'],
    'Science': ['👨‍🔬', '👩‍🔬', '🧑‍🔬']
};

// Random emoji generator based on course
export const getRandomEmojiForCourse = (course) => {
    const emojis = courseEmojis[course] || ['🧑‍🎓', '👨‍🎓', '👩‍🎓'];
    return emojis[Math.floor(Math.random() * emojis.length)];
};

// Legacy functions for backward compatibility
export const studentsData = defaultStudentsData;
export const getStudentById = (id) => StudentStorage.getStudentById(id);
export const searchStudents = (query) => StudentStorage.searchStudents(query);