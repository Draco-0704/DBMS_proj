const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT e.*, d.name as department_name, r.name as role_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id LEFT JOIN roles r ON e.role_id = r.role_id WHERE e.is_active = 1';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
    const employeeId = req.params.id;
    try {
        const query = 'SELECT e.*, d.name as department_name, r.name as role_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id LEFT JOIN roles r ON e.role_id = r.role_id WHERE e.employee_id = ? AND e.is_active = 1';
        const [results] = await db.execute(query, [employeeId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create employee
router.post('/', async (req, res) => {
    const employee = req.body;
    const userRole = req.headers['user-role'] || req.body.userRole;

    if (userRole !== 'Admin' && userRole !== 'Manager') {
        return res.status(403).json({ error: 'Access denied. Only Admins and Managers can create employees.' });
    }

    try {
        const query = 'INSERT INTO employees (first_name, last_name, email, phone, date_of_birth, gender, marital_status, address, city, state, pincode, aadhaar_number, pan_number, emergency_contact_name, emergency_contact_phone, department_id, role_id, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            employee.first_name,
            employee.last_name,
            employee.email,
            employee.phone,
            employee.date_of_birth,
            employee.gender,
            employee.marital_status,
            employee.address,
            employee.city,
            employee.state,
            employee.pincode,
            employee.aadhaar_number,
            employee.pan_number,
            employee.emergency_contact_name,
            employee.emergency_contact_phone,
            employee.department_id,
            employee.role_id,
            employee.hire_date
        ];

        const [result] = await db.execute(query, values);

        res.status(201).json({
            message: 'Employee created successfully',
            employee_id: result.insertId
        });
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update employee
router.put('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const employee = req.body;
    const userRole = req.headers['user-role'] || req.body.userRole;

    if (userRole !== 'Admin') {
        return res.status(403).json({ error: 'Access denied. Only Admins can edit employee information.' });
    }

    try {
        const query = 'UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, marital_status = ?, address = ?, city = ?, state = ?, pincode = ?, aadhaar_number = ?, pan_number = ?, emergency_contact_name = ?, emergency_contact_phone = ?, department_id = ?, role_id = ?, hire_date = ?, termination_date = ?, is_active = ? WHERE employee_id = ?';
        const values = [
            employee.first_name,
            employee.last_name,
            employee.email,
            employee.phone,
            employee.date_of_birth,
            employee.gender,
            employee.marital_status,
            employee.address,
            employee.city,
            employee.state,
            employee.pincode,
            employee.aadhaar_number,
            employee.pan_number,
            employee.emergency_contact_name,
            employee.emergency_contact_phone,
            employee.department_id,
            employee.role_id,
            employee.hire_date,
            employee.termination_date,
            employee.is_active,
            employeeId
        ];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete employee (soft delete)
router.delete('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const userRole = req.headers['user-role'] || req.body.userRole;

    if (userRole !== 'Admin') {
        return res.status(403).json({ error: 'Access denied. Only Admins can delete employees.' });
    }

    try {
        const query = 'UPDATE employees SET is_active = 0 WHERE employee_id = ?';
        const [result] = await db.execute(query, [employeeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
