// Simple localStorage-based storage system
export const StorageManager = {
    // Get all students
    getAllStudents: () => {
        if (typeof window !== 'undefined') {
            const students = localStorage.getItem('students');
            return students ? JSON.parse(students) : [];
        }
        return [];
    },

    // Get student by ID
    getStudentById: (id) => {
        const students = StorageManager.getAllStudents();
        return students.find(student => student.id === id);
    },

    // Add new student
    addStudent: (student) => {
        const students = StorageManager.getAllStudents();
        const newStudent = {
            ...student,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        return newStudent;
    },

    // Update student
    updateStudent: (id, updatedData) => {
        const students = StorageManager.getAllStudents();
        const index = students.findIndex(student => student.id === id);
        if (index !== -1) {
            students[index] = {
                ...students[index],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('students', JSON.stringify(students));
            return students[index];
        }
        return null;
    },

    // Delete student
    deleteStudent: (id) => {
        const students = StorageManager.getAllStudents();
        const filteredStudents = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(filteredStudents));
        return true;
    },

    // Search students
    searchStudents: (query) => {
        const students = StorageManager.getAllStudents();
        const lowercaseQuery = query.toLowerCase();
        return students.filter(student =>
            student.firstName.toLowerCase().includes(lowercaseQuery) ||
            student.lastName.toLowerCase().includes(lowercaseQuery) ||
            student.email.toLowerCase().includes(lowercaseQuery) ||
            student.studentId.toLowerCase().includes(lowercaseQuery)
        );
    }
};