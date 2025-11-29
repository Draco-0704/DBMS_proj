const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all payroll records
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT p.*, e.first_name, e.last_name FROM payroll p JOIN employees e ON p.employee_id = e.employee_id';
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching payroll records:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create payroll record
router.post('/', async (req, res) => {
    const payroll = req.body;
    try {
        const query = 'INSERT INTO payroll (employee_id, basic_salary, hra, da, medical_allowance, conveyance_allowance, other_allowance, income_tax, professional_tax, provident_fund, other_deductions, net_salary, payment_date, payslip_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            payroll.employee_id,
            payroll.basic_salary,
            payroll.hra || 0,
            payroll.da || 0,
            payroll.medical_allowance || 0,
            payroll.conveyance_allowance || 0,
            payroll.other_allowance || 0,
            payroll.income_tax || 0,
            payroll.professional_tax || 0,
            payroll.provident_fund || 0,
            payroll.other_deductions || 0,
            payroll.net_salary,
            payroll.payment_date,
            payroll.payslip_url || null
        ];

        const [result] = await db.execute(query, values);

        res.status(201).json({
            message: 'Payroll record created successfully',
            payroll_id: result.insertId
        });
    } catch (err) {
        console.error('Error creating payroll record:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
