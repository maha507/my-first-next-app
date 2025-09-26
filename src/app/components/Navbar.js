'use client';
import Link from 'next/link';
import { FaGraduationCap, FaUsers, FaPlus, FaHome } from 'react-icons/fa';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link href="/" className="logo">
                        <FaGraduationCap size={32} style={{ display: 'inline', marginRight: '10px' }} />
                        StudentHub
                    </Link>

                    <ul className="nav-links">
                        <li>
                            <Link href="/" className="nav-link">
                                <FaHome size={18} style={{ display: 'inline', marginRight: '5px' }} />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/students" className="nav-link">
                                <FaUsers size={18} style={{ display: 'inline', marginRight: '5px' }} />
                                Students
                            </Link>
                        </li>
                        <li>
                            <Link href="/students/add" className="nav-link">
                                <FaPlus size={18} style={{ display: 'inline', marginRight: '5px' }} />
                                Add Student
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}