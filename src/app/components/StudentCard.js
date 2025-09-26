'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MdEmail, MdPhone, MdCalendarToday, MdBook, MdStars, MdVisibility } from 'react-icons/md';

export default function StudentCard({ student }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Image
                    src={student.profileImage || '/images/default-avatar.jpg'}
                    alt={`${student.firstName} ${student.lastName}`}
                    width={80}
                    height={80}
                    className="avatar"
                    style={{ margin: '0 auto' }}
                />
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
                    <span style={{ fontSize: '0.9rem' }}>{student.email}</span>
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