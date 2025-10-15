'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import StudentForm from '../../../components/StudentForm';
import { StudentStorage } from '@/lib/studentData';

export default function EditStudentPage({ params }) {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const resolvedParams = use(params);
    const studentId = resolvedParams.id;

    useEffect(() => {
        const foundStudent = StudentStorage.getStudentById(studentId);
        if (foundStudent) {
            setStudent(foundStudent);
        } else {
            router.push('/students');
        }
        setLoading(false);
    }, [studentId, router]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="text-center" style={{ padding: '60px', color: 'white' }}>
                        <div style={{ fontSize: '1.2rem' }}>Loading...</div>
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
                <StudentForm student={student} isEdit={true} />
            </div>
        </>
    );
}