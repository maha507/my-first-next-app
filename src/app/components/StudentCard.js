'use client';
import Link from 'next/link';
import { MdEmail, MdPhone, MdCalendarToday, MdBook, MdStars, MdVisibility } from 'react-icons/md';

export default function StudentCard({ student }) {
    // Check if profileImage is an emoji (single character) or URL
    const isEmoji = student.profileImage && student.profileImage.length <= 4;

    return (
        <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                    className="emoji-avatar"
                    style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#667eea',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: isEmoji ? '40px' : '24px',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                        border: '4px solid white'
                    }}
                >
                    {isEmoji ? student.profileImage : `${student.firstName[0]}${student.lastName[0]}`}
                </div>
                <h3 style={{ margin: '15px 0 5px', fontSize: '1.3rem', fontWeight: '600' }}>
                    {student.firstName} {student.lastName}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    ID: {student.studentId}
                </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <MdEmail size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                    <span style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>{student.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <MdPhone size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                    <span style={{ fontSize: '0.9rem' }}>{student.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <MdBook size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                    <span style={{ fontSize: '0.9rem' }}>{student.course}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <MdCalendarToday size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                    <span style={{ fontSize: '0.9rem' }}>{student.year}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <MdStars size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                    <span style={{ fontSize: '0.9rem' }}>GPA: {student.gpa}</span>
                </div>
            </div>

            <Link href={`/students/${student.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                <MdVisibility size={16} />
                View Details
            </Link>
        </div>
    );
}