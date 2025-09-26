'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';
import { FaSearch, FaPlus, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { StudentStorage } from '@/lib/studentData';

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        loadStudents();
    }, []);

    useEffect(() => {
        const filtered = StudentStorage.searchStudents(searchTerm);
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const loadStudents = () => {
        setLoading(true);
        // Simulate loading delay
        setTimeout(() => {
            const studentsData = StudentStorage.getAllStudents();
            setStudents(studentsData);
            setFilteredStudents(studentsData);
            setLoading(false);
        }, 300);
    };

    // Refresh data when component becomes visible again
    useEffect(() => {
        const handleFocus = () => {
            loadStudents();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 10px 0' }}>
                            <FaUsers size={40} style={{ display: 'inline', marginRight: '15px' }} />
                            Students Directory
                        </h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', margin: 0 }}>
                            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <Link href="/students/add" className="btn btn-primary">
                        <FaPlus size={16} />
                        Add New Student
                    </Link>
                </div>

                <div className="card" style={{ marginBottom: '30px' }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch
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

                {/* Refresh button */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <button
                        onClick={loadStudents}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh Students'}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '60px', color: 'white' }}>
                        <div style={{ fontSize: '1.2rem' }}>Loading students...</div>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="card text-center" style={{ padding: '60px' }}>
                        <FaUsers size={64} style={{ color: '#667eea', marginBottom: '20px' }} />
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
                                <FaPlus size={16} />
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