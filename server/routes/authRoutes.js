const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const [users] = await db.execute(
            'SELECT u.*, e.first_name, e.last_name, r.name as role_name FROM users u LEFT JOIN employees e ON u.employee_id = e.employee_id LEFT JOIN roles r ON u.role_id = r.role_id WHERE u.username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = users[0];

        // Compare password
        // Note: In a real production app with the seed data provided, the hashes might be dummy values.
        // We will try bcrypt compare first.
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            // Fallback for the specific seed data if bcrypt fails (since the seed might have used a specific hash or just a string that looks like one)
            // However, for security, we should strictly use bcrypt. 
            // If the seed data has valid bcrypt hashes for 'password123', this will work.
            // If not, the user might need to reset passwords or we might need to re-seed with known good hashes.
            // For now, we assume standard bcrypt behavior.
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Update last login
        await db.execute('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                role_name: user.role_name,
                employee_id: user.employee_id,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { username, password, first_name, last_name, email, role_name } = req.body;

    if (!username || !password || !first_name || !last_name || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if username exists
        const [existingUsers] = await db.execute('SELECT user_id FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Find or Create Role
            let roleId;
            const [roles] = await connection.execute('SELECT role_id FROM roles WHERE name = ?', [role_name || 'Employee']);
            if (roles.length > 0) {
                roleId = roles[0].role_id;
            } else {
                // Default to Employee if role not found
                const [defaultRoles] = await connection.execute('SELECT role_id FROM roles WHERE name = ?', ['Employee']);
                roleId = defaultRoles[0].role_id;
            }

            // 2. Create Employee record (simplified for signup)
            const [empResult] = await connection.execute(
                'INSERT INTO employees (first_name, last_name, email, role_id, hire_date) VALUES (?, ?, ?, ?, CURDATE())',
                [first_name, last_name, email, roleId]
            );
            const employeeId = empResult.insertId;

            // 3. Create User record
            await connection.execute(
                'INSERT INTO users (employee_id, username, password_hash, role_id) VALUES (?, ?, ?, ?)',
                [employeeId, username, passwordHash, roleId]
            );

            await connection.commit();

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    username,
                    role_name: role_name || 'Employee',
                    employee_id: employeeId,
                    first_name,
                    last_name,
                    email
                }
            });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

module.exports = router;
