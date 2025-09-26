'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import StudentProfile from '../../components/StudentProfile';

export default function StudentDetailsPage({ params }) {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const response = await fetch(`/api/students/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setStudent(data);
            } else {
                router.push('/students');
            }
        } catch (error) {
            console.error('Error fetching student:', error);
            router.push('/students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/students/${params.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    router.push('/students');
                } else {
                    alert('Error deleting student');
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Error deleting student');
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