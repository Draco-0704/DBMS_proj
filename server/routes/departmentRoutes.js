const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all departments
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM departments';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
