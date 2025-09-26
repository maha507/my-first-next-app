import Link from 'next/link';
import Navbar from './components/Navbar';
import { Users, Plus, Search, BookOpen } from 'lucide-react';

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="container">
                <div className="hero">
                    <h1>Student Management System</h1>
                    <p>Manage your student information efficiently and beautifully</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/students" className="btn btn-primary">
                            <Users size={16} />
                            View All Students
                        </Link>
                        <Link href="/students/add" className="btn btn-secondary">
                            <Plus size={16} />
                            Add New Student
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-3" style={{ marginTop: '60px' }}>
                    <div className="card text-center">
                        <div style={{ color: '#667eea', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                            <Users size={48} />
                        </div>
                        <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Student Records</h3>
                        <p style={{ color: '#666' }}>
                            Comprehensive student information management with detailed profiles, academic records, and contact details.
                        </p>
                        <Link href="/students" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Explore Students
                        </Link>
                    </div>

                    <div className="card text-center">
                        <div style={{ color: '#667eea', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                            <Search size={48} />
                        </div>
                        <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Advanced Search</h3>
                        <p style={{ color: '#666' }}>
                            Quickly find students by name, ID, email, or any other criteria with our powerful search functionality.
                        </p>
                        <Link href="/students" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Search Now
                        </Link>
                    </div>

                    <div className="card text-center">
                        <div style={{ color: '#667eea', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                            <BookOpen size={48} />
                        </div>
                        <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Academic Tracking</h3>
                        <p style={{ color: '#666' }}>
                            Track academic performance, courses, GPAs, and year progression for comprehensive student monitoring.
                        </p>
                        <Link href="/students/add" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Add Student
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}