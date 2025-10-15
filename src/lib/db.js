// Database utility for D1
// This module provides a consistent interface for database operations

/**
 * Get the database instance from environment bindings
 * In Cloudflare Pages/Workers, this will be available via context
 * For local development, use wrangler dev or mock data
 */
export function getDb(env) {
    if (env && env.DB) {
        return env.DB;
    }

    console.warn('DB binding not found. Make sure you are running with Cloudflare Workers/Pages or using wrangler dev.');
    return null;
}

/**
 * Get all students with optional search filtering
 */
export async function getStudents(db, searchQuery = null) {
    if (!db) {
        throw new Error('Database connection not available');
    }

    let query = 'SELECT * FROM students';
    const params = [];

    if (searchQuery) {
        query += ' WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR studentId LIKE ?';
        const searchPattern = `%${searchQuery}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY createdAt DESC';

    const result = await db.prepare(query).bind(...params).all();
    return result.results || [];
}

/**
 * Get a single student by ID
 */
export async function getStudentById(db, id) {
    if (!db) {
        throw new Error('Database connection not available');
    }

    const result = await db
        .prepare('SELECT * FROM students WHERE id = ?')
        .bind(id)
        .first();

    return result;
}

/**
 * Create a new student
 */
export async function createStudent(db, studentData) {
    if (!db) {
        throw new Error('Database connection not available');
    }

    const id = Date.now().toString();
    const now = new Date().toISOString();

    const result = await db
        .prepare(`
            INSERT INTO students (
                id, firstName, lastName, email, studentId, phone,
                dateOfBirth, course, year, gpa, address, profileImage,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            id,
            studentData.firstName,
            studentData.lastName,
            studentData.email,
            studentData.studentId,
            studentData.phone || null,
            studentData.dateOfBirth || null,
            studentData.course || null,
            studentData.year || null,
            studentData.gpa || null,
            studentData.address || null,
            studentData.profileImage || '/images/default-avatar.jpg',
            now,
            now
        )
        .run();

    if (!result.success) {
        throw new Error('Failed to create student');
    }

    return {
        id,
        ...studentData,
        profileImage: studentData.profileImage || '/images/default-avatar.jpg',
        createdAt: now,
        updatedAt: now
    };
}

/**
 * Update an existing student
 */
export async function updateStudent(db, id, studentData) {
    if (!db) {
        throw new Error('Database connection not available');
    }

    const now = new Date().toISOString();

    const result = await db
        .prepare(`
            UPDATE students SET
                firstName = ?, lastName = ?, email = ?, studentId = ?,
                phone = ?, dateOfBirth = ?, course = ?, year = ?,
                gpa = ?, address = ?, profileImage = ?, updatedAt = ?
            WHERE id = ?
        `)
        .bind(
            studentData.firstName,
            studentData.lastName,
            studentData.email,
            studentData.studentId,
            studentData.phone || null,
            studentData.dateOfBirth || null,
            studentData.course || null,
            studentData.year || null,
            studentData.gpa || null,
            studentData.address || null,
            studentData.profileImage || '/images/default-avatar.jpg',
            now,
            id
        )
        .run();

    if (!result.success || result.meta.changes === 0) {
        return null;
    }

    return await getStudentById(db, id);
}

/**
 * Delete a student
 */
export async function deleteStudent(db, id) {
    if (!db) {
        throw new Error('Database connection not available');
    }

    // Get student data before deleting for notification
    const student = await getStudentById(db, id);

    if (!student) {
        return null;
    }

    const result = await db
        .prepare('DELETE FROM students WHERE id = ?')
        .bind(id)
        .run();

    if (!result.success || result.meta.changes === 0) {
        return null;
    }

    return student;
}
