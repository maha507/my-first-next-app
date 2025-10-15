-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    studentId TEXT NOT NULL UNIQUE,
    phone TEXT,
    dateOfBirth TEXT,
    course TEXT,
    year TEXT,
    gpa TEXT,
    address TEXT,
    profileImage TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Create index on studentId for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_studentId ON students(studentId);

-- Insert initial seed data
INSERT INTO students (id, firstName, lastName, email, studentId, phone, dateOfBirth, course, year, gpa, address, profileImage, createdAt, updatedAt)
VALUES
    ('1', 'John', 'Doe', 'john.doe@email.com', 'STU001', '+1 234-567-8900', '2000-05-15', 'Computer Science', '3rd Year', '3.8', '123 Main St, City, State', '/images/default-avatar.jpg', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z'),
    ('2', 'Jane', 'Smith', 'jane.smith@email.com', 'STU002', '+1 234-567-8901', '1999-08-22', 'Business Administration', '2nd Year', '3.9', '456 Oak Ave, City, State', '/images/default-avatar.jpg', '2024-01-02T00:00:00Z', '2024-01-02T00:00:00Z');
