// Remote Cloudflare D1 database access via wrangler API
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DB_NAME = 'students-db';

/**
 * Execute a SQL query on remote D1 database
 */
async function executeRemoteQuery(sql, params = []) {
    try {
        // Escape single quotes in SQL
        const escapedSql = sql.replace(/'/g, "\\'");

        // For parameterized queries, we need to replace ? with actual values
        let finalSql = sql;
        if (params.length > 0) {
            params.forEach(param => {
                const value = param === null ? 'NULL' : `'${String(param).replace(/'/g, "''")}'`;
                finalSql = finalSql.replace('?', value);
            });
        }

        const command = `npx wrangler d1 execute ${DB_NAME} --remote --command "${finalSql.replace(/"/g, '\\"')}"`;
        const { stdout, stderr } = await execAsync(command);

        if (stderr && !stderr.includes('Executed')) {
            console.error('D1 Error:', stderr);
        }

        // Parse the output to extract results
        try {
            const match = stdout.match(/\[([\s\S]*)\]/);
            if (match) {
                const jsonStr = match[0];
                const parsed = JSON.parse(jsonStr);
                if (parsed[0] && parsed[0].results) {
                    return parsed[0].results;
                }
            }
        } catch (e) {
            console.error('Failed to parse D1 output:', e);
        }

        return [];
    } catch (error) {
        console.error('Remote D1 query failed:', error);
        throw new Error('Database query failed');
    }
}

/**
 * Get all students with optional search filtering
 */
export async function getStudents(searchQuery = null) {
    let sql = 'SELECT * FROM students';
    const params = [];

    if (searchQuery) {
        sql += ' WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR studentId LIKE ?';
        const searchPattern = `%${searchQuery}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY createdAt DESC';

    return await executeRemoteQuery(sql, params);
}

/**
 * Get a single student by ID
 */
export async function getStudentById(id) {
    const results = await executeRemoteQuery('SELECT * FROM students WHERE id = ?', [id]);
    return results[0] || null;
}

/**
 * Create a new student
 */
export async function createStudent(studentData) {
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const sql = `
        INSERT INTO students (
            id, firstName, lastName, email, studentId, phone,
            dateOfBirth, course, year, gpa, address, profileImage,
            createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeRemoteQuery(sql, [
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
    ]);

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
    const now = new Date().toISOString();

    const sql = `
        UPDATE students SET
            firstName = ?, lastName = ?, email = ?, studentId = ?,
            phone = ?, dateOfBirth = ?, course = ?, year = ?,
            gpa = ?, address = ?, profileImage = ?, updatedAt = ?
        WHERE id = ?
    `;

    await executeRemoteQuery(sql, [
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
    ]);

    return await getStudentById(id);
}

/**
 * Delete a student
 */
export async function deleteStudent(id) {
    // Get student data before deleting
    const student = await getStudentById(id);

    if (!student) {
        return null;
    }

    await executeRemoteQuery('DELETE FROM students WHERE id = ?', [id]);

    return student;
}
