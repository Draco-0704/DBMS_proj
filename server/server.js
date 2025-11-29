const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));

// Legacy route for leave types (to maintain compatibility or we can update frontend)
// We'll map /api/leave-types to the handler in leaveRoutes if we want, 
// but for now let's just add a specific route here that delegates to the DB
app.get('/api/leave-types', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM leave_types');
    res.json(results);
  } catch (err) {
    console.error('Error fetching leave types:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Employee Management System API' });
});

// Database initialization route
app.get('/api/init-db', async (req, res) => {
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');

    if (!fs.existsSync(schemaPath)) {
      return res.status(404).json({ error: 'Schema file not found' });
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seed = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : '';

    // Execute schema
    // Note: mysql2 promise pool execute/query might not handle multiple statements by default unless configured.
    // We configured multipleStatements: true in db.js

    await db.query(schema);

    if (seed) {
      await db.query(seed);
      res.json({ message: 'Database initialized successfully with sample data' });
    } else {
      res.json({ message: 'Database schema created successfully' });
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database: ' + error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
