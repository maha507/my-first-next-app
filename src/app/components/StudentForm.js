'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdSave, MdPerson, MdEmail, MdPhone, MdCalendarToday, MdBook, MdLocationOn, MdStars } from 'react-icons/md';

export default function StudentForm({ student = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: student?.firstName || '',
        lastName: student?.lastName || '',
        email: student?.email || '',
        studentId: student?.studentId || '',
        phone: student?.phone || '',
        dateOfBirth: student?.dateOfBirth || '',
        course: student?.course || '',
        year: student?.year || '',
        gpa: student?.gpa || '',
        address: student?.address || '',
        profileImage: student?.profileImage || '/images/default-avatar.jpg'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/students/${student.id}` : '/api/students';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/students');
                router.refresh();
            } else {
                alert('Error saving student');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '600', color: '#667eea' }}>
                {isEdit ? 'Edit Student' : 'Add New Student'}
            </h2>

            <div className="grid grid-cols-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                    <label className="form-label">
                        <MdPerson size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <MdPerson size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                    <label className="form-label">
                        <MdEmail size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Student ID
                    </label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                    <label className="form-label">
                        <MdPhone size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <MdCalendarToday size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                    <label className="form-label">
                        <MdBook size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        Course
                    </label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="form-input"
                        required
                    >
                        <option value="">Select Course</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Arts">Arts</option>
                        <option value="Science">Science</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Year
                    </label>
                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="form-input"
                        required
                    >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                    <MdStars size={16} style={{ display: 'inline', marginRight: '5px' }} />
                    GPA
                </label>
                <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    max="4"
                    step="0.1"
                    required
                />
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
                <label className="form-label">
                    <MdLocationOn size={16} style={{ display: 'inline', marginRight: '5px' }} />
                    Address
                </label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%' }}
            >
                <MdSave size={16} />
                {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student')}
            </button>
        </form>
    );
}