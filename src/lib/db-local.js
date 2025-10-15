// Local database access using better-sqlite3
// This connects to the local D1 database created by wrangler
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db = null;

function getLocalDb() {
    if (db) return db;

    // Path to wrangler's local D1 database
    const dbPath = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/d90cd9566698fd3c6fcccc4c9bf99b901a25f4b59d71dca5d0adebe9d3967a55.sqlite');

    // Check if database exists
    if (!fs.existsSync(dbPath)) {
        console.error('Local D1 database not found. Please run: npm run db:migrate');
        return null;
    }

    db = new Database(dbPath);
    return db;
}

/**
 * Get all students with optional search filtering
 */
export async function getStudents(searchQuery = null) {
    const db = getLocalDb();
    if (!db) throw new Error('Database not available');

    let query = 'SELECT * FROM students';
    const params = [];

    if (searchQuery) {
        query += ' WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR studentId LIKE ?';
        const searchPattern = `%${searchQuery}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY createdAt DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
}

/**
 * Get a single student by ID
 */
export async function getStudentById(id) {
    const db = getLocalDb();
    if (!db) throw new Error('Database not available');

    const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
    return stmt.get(id);
}

/**
 * Create a new student
 */
export async function createStudent(studentData) {
    const db = getLocalDb();
    if (!db) throw new Error('Database not available');

    const id = Date.now().toString();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
        INSERT INTO students (
            id, firstName, lastName, email, studentId, phone,
            dateOfBirth, course, year, gpa, address, profileImage,
            createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
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
    );

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
export async function updateStudent(id, studentData) {
    const db = getLocalDb();
    if (!db) throw new Error('Database not available');

    const now = new Date().toISOString();

    const stmt = db.prepare(`
        UPDATE students SET
            firstName = ?, lastName = ?, email = ?, studentId = ?,
            phone = ?, dateOfBirth = ?, course = ?, year = ?,
            gpa = ?, address = ?, profileImage = ?, updatedAt = ?
        WHERE id = ?
    `);

    const result = stmt.run(
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
    );

    if (result.changes === 0) {
        return null;
    }

    return await getStudentById(id);
}

/**
 * Delete a student
 */
export async function deleteStudent(id) {
    const db = getLocalDb();
    if (!db) throw new Error('Database not available');

    // Get student data before deleting
    const student = await getStudentById(id);

    if (!student) {
        return null;
    }

    const stmt = db.prepare('DELETE FROM students WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
        return null;
    }

    return student;
}
