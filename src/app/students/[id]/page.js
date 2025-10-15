'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import StudentProfile from '../../components/StudentProfile';
import { StudentStorage } from '@/lib/studentData';

export default function StudentDetailsPage({ params }) {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const resolvedParams = use(params);
    const studentId = resolvedParams.id;

    useEffect(() => {
        loadStudent();
    }, [studentId]);

    const loadStudent = () => {
        setTimeout(() => {
            const foundStudent = StudentStorage.getStudentById(studentId);
            if (foundStudent) {
                setStudent(foundStudent);
            } else {
                router.push('/students');
            }
            setLoading(false);
        }, 300);
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                StudentStorage.deleteStudent(studentId);
                router.push('/students');
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="text-center" style={{ padding: '60px', color: 'white' }}>
                        <div style={{ fontSize: '1.2rem' }}>Loading student details...</div>
                    </div>
                </div>
            </>
        );
    }

    if (!student) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="card text-center" style={{ padding: '60px' }}>
                        <h2 style={{ color: '#667eea', marginBottom: '15px' }}>Student Not Found</h2>
                        <p style={{ color: '#666' }}>The requested student could not be found.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <StudentProfile student={student} onDelete={handleDelete} />
            </div>
        </>
    );
}