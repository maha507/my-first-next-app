'use client';
import Image from 'next/image';
import { MdEmail, MdPhone, MdCalendarToday, MdBook, MdLocationOn, MdStars, MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import Link from 'next/link';

export default function StudentProfile({ student, onDelete }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <Link href="/students" className="btn btn-secondary">
                    <MdArrowBack size={16} />
                    Back to Students
                </Link>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href={`/students/${student.id}/edit`} className="btn btn-primary">
                        <MdEdit size={16} />
                        Edit
                    </Link>
                    <button onClick={onDelete} className="btn btn-danger">
                        <MdDelete size={16} />
                        Delete
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                <Image
                    src={student.profileImage || '/images/default-avatar.jpg'}
                    alt={`${student.firstName} ${student.lastName}`}
                    width={150}
                    height={150}
                    className="avatar avatar-lg"
                />
                <h1 style={{ margin: '20px 0 5px', fontSize: '2.5rem', fontWeight: '700', color: '#667eea' }}>
                    {student.firstName} {student.lastName}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#666', margin: 0 }}>
                    Student ID: {student.studentId}
                </p>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '30px' }}>
                <div>
                    <h3 style={{ marginBottom: '20px', color: '#667eea', fontSize: '1.3rem' }}>Contact Information</h3>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <MdEmail size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                        <div>
                            <strong>Email:</strong>
                            <br />
                            <a href={`mailto:${student.email}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                                {student.email}
                            </a>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <MdPhone size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                        <div>
                            <strong>Phone:</strong>
                            <br />
                            <a href={`tel:${student.phone}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                                {student.phone}
                            </a>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <MdLocationOn size={20} style={{ marginRight: '12px', color: '#667eea', marginTop: '2px' }} />
                        <div>
                            <strong>Address:</strong>
                            <br />
                            {student.address}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '20px', color: '#667eea', fontSize: '1.3rem' }}>Academic Information</h3>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <MdBook size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                        <div>
                            <strong>Course:</strong>
                            <br />
                            {student.course}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <MdCalendarToday size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                        <div>
                            <strong>Year:</strong>
                            <br />
                            {student.year}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <MdStars size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                        <div>
                            <strong>GPA:</strong>
                            <br />
                            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#667eea' }}>
                {student.gpa}/4.0
              </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <MdCalendarToday size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                        <div>
                            <strong>Date of Birth:</strong>
                            <br />
                            {formatDate(student.dateOfBirth)}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                    <div>
                        <strong>Created:</strong> {formatDate(student.createdAt)}
                    </div>
                    <div>
                        <strong>Last Updated:</strong> {formatDate(student.updatedAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}