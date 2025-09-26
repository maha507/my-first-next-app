'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';
import { Search, Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.course.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/students');
            if (response.ok) {
                const data = await response.json();
                setStudents(data);
                setFilteredStudents(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 10px 0' }}>
                            <Users size={40} style={{ display: 'inline', marginRight: '15px' }} />
                            Students Directory
                        </h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', margin: 0 }}>
                            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <Link href="/students/add" className="btn btn-primary">
                        <Plus size={16} />
                        Add New Student
                    </Link>
                </div>

                <div className="card" style={{ marginBottom: '30px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#667eea'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search students by name, ID, email, or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '50px', margin: 0 }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '60px', color: 'white' }}>
                        <div style={{ fontSize: '1.2rem' }}>Loading students...</div>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="card text-center" style={{ padding: '60px' }}>
                        <Users size={64} style={{ color: '#667eea', marginBottom: '20px' }} />
                        <h3 style={{ color: '#667eea', marginBottom: '15px' }}>
                            {searchTerm ? 'No students found' : 'No students yet'}
                        </h3>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            {searchTerm
                                ? `No students match "${searchTerm}". Try a different search term.`
                                : 'Get started by adding your first student to the system.'
                            }
                        </p>
                        {!searchTerm && (
                            <Link href="/students/add" className="btn btn-primary">
                                <Plus size={16} />
                                Add First Student
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-3">
                        {filteredStudents.map((student) => (
                            <StudentCard key={student.id} student={student} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}