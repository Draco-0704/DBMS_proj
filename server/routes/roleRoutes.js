const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all roles
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM roles';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching roles:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
