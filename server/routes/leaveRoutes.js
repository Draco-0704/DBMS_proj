const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all leave requests
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT lr.*, e.first_name, e.last_name, lt.name as leave_type_name FROM leave_requests lr JOIN employees e ON lr.employee_id = e.employee_id JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching leave requests:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create leave request
router.post('/', async (req, res) => {
    const leave = req.body;
    try {
        const query = 'INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [
            leave.employee_id,
            leave.leave_type_id,
            leave.start_date,
            leave.end_date,
            leave.reason,
            leave.status || 'Pending'
        ];

        const [result] = await db.execute(query, values);

        res.status(201).json({
            message: 'Leave request created successfully',
            leave_id: result.insertId
        });
    } catch (err) {
        console.error('Error creating leave request:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update leave request status
router.put('/:id', async (req, res) => {
    const leaveId = req.params.id;
    const { status, approved_by, approved_at } = req.body;

    try {
        const query = 'UPDATE leave_requests SET status = ?, approved_by = ?, approved_at = ? WHERE leave_id = ?';
        const values = [
            status,
            approved_by,
            approved_at,
            leaveId
        ];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        res.json({ message: 'Leave request updated successfully' });
    } catch (err) {
        console.error('Error updating leave request:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all leave types
router.get('/types', async (req, res) => {
    try {
        const query = 'SELECT * FROM leave_types';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching leave types:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
