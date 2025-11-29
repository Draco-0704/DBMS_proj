const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all attendance records
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT a.*, e.first_name, e.last_name FROM attendance a JOIN employees e ON a.employee_id = e.employee_id';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create attendance record
router.post('/', async (req, res) => {
    const attendance = req.body;
    try {
        const query = 'INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, status) VALUES (?, ?, ?, ?, ?)';
        const values = [
            attendance.employee_id,
            attendance.date,
            attendance.check_in_time,
            attendance.check_out_time,
            attendance.status
        ];

        const [result] = await db.execute(query, values);

        res.status(201).json({
            message: 'Attendance record created successfully',
            attendance_id: result.insertId
        });
    } catch (err) {
        console.error('Error creating attendance record:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
