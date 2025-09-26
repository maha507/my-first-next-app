import Navbar from '../../components/Navbar';
import StudentForm from '../../components/StudentForm';

export default function AddStudentPage() {
    return (
        <>
            <Navbar />
            <div className="container">
                <StudentForm />
            </div>
        </>
    );
}