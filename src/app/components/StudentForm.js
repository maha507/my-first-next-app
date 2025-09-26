'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdSave, MdPerson, MdEmail, MdPhone, MdCalendarToday, MdBook, MdLocationOn, MdStars } from 'react-icons/md';
import { courseEmojis, getRandomEmojiForCourse, StudentStorage } from '@/lib/studentData';

export default function StudentForm({ student = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        phone: '',
        dateOfBirth: '',
        course: '',
        year: '',
        gpa: '',
        address: '',
        profileImage: '🧑‍🎓'
    });

    // Initialize form data
    useEffect(() => {
        if (isEdit && student) {
            setFormData(student);
        } else if (!isEdit) {
            // Generate new student ID for new students
            const newStudentId = StudentStorage.generateStudentId();
            setFormData(prev => ({
                ...prev,
                studentId: newStudentId
            }));
        }
    }, [student, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If course changes, suggest a random emoji for that course
        if (name === 'course' && value) {
            const suggestedEmoji = getRandomEmojiForCourse(value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                profileImage: suggestedEmoji
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEmojiSelect = (emoji) => {
        setFormData(prev => ({
            ...prev,
            profileImage: emoji
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                // Update existing student
                StudentStorage.updateStudent(student.id, formData);
                alert('Student updated successfully!');
            } else {
                // Add new student
                StudentStorage.addStudent(formData);
                alert('Student added successfully!');
            }

            // Navigate back to students list
            router.push('/students');

            // Trigger a page refresh to show updated data
            window.location.reload();

        } catch (error) {
            console.error('Error saving student:', error);
            alert('Error saving student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get available emojis for current course
    const availableEmojis = formData.course ?
        [...courseEmojis[formData.course], '🧑‍🎓', '👨‍🎓', '👩‍🎓', '😊', '😎', '🤓', '🙂', '😄', '🤗'] :
        ['🧑‍🎓', '👨‍🎓', '👩‍🎓', '😊', '😎', '🤓', '🙂', '😄', '🤗', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼'];

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '600', color: '#667eea' }}>
                {isEdit ? 'Edit Student' : 'Add New Student'}
            </h2>

            {/* Avatar Selection */}
            <div className="form-group" style={{ marginBottom: '30px' }}>
                <label className="form-label">Choose Avatar</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#667eea',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '40px',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                            border: '4px solid white'
                        }}
                    >
                        {formData.profileImage}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, 50px)',
                            gap: '10px',
                            maxHeight: '120px',
                            overflowY: 'auto',
                            padding: '10px',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            borderRadius: '12px'
                        }}>
                            {availableEmojis.map((emoji, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleEmojiSelect(emoji)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        border: formData.profileImage === emoji ? '2px solid #667eea' : '2px solid transparent',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                        readOnly={!isEdit}
                        style={{ backgroundColor: !isEdit ? '#f5f5f5' : 'white' }}
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