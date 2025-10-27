const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
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


// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'srikant123',
  database: process.env.DB_NAME || 'employee_management_system',
  multipleStatements: true
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.log('Database connection failed. Please check your MySQL server and database configuration.');
    console.log('Make sure MySQL is running and the database "employee_management_system" exists.');
    console.log('You can create the database by running the schema.sql file in your MySQL client.');
    // Continue running the server even if database connection fails
  } else {
    console.log('Connected to MySQL database successfully');
  }
});

// Handle database connection errors
db.on('error', (err) => {
  console.error('Database connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Database connection lost. Attempting to reconnect...');
    db.connect();
  } else {
    console.log('Database error occurred, but server will continue running...');
    console.log('Please check your MySQL configuration and restart the server.');
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Employee Management System API' });
});

// Database initialization route
app.get('/api/init-db', (req, res) => {
  const fs = require('fs');
  const path = require('path');

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
    db.query(schema, (err) => {
      if (err) {
        console.error('Error executing schema:', err);
        return res.status(500).json({ error: 'Failed to initialize database schema' });
      }

      // Execute seed data if available
      if (seed) {
        db.query(seed, (err) => {
          if (err) {
            console.error('Error executing seed data:', err);
            return res.status(500).json({ error: 'Database schema created but seed data failed' });
          }

          res.json({ message: 'Database initialized successfully with sample data' });
        });
      } else {
        res.json({ message: 'Database schema created successfully' });
      }
    });
  } catch (error) {
    console.error('Error reading database files:', error);
    res.status(500).json({ error: 'Failed to read database files' });
  }
});

// Employee routes
app.get('/api/employees', (req, res) => {
  const query = 'SELECT e.*, d.name as department_name, r.name as role_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id LEFT JOIN roles r ON e.role_id = r.role_id WHERE e.is_active = 1';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = 'SELECT e.*, d.name as department_name, r.name as role_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id LEFT JOIN roles r ON e.role_id = r.role_id WHERE e.employee_id = ? AND e.is_active = 1';

  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(results[0]);
  });
});

app.post('/api/employees', (req, res) => {
  const employee = req.body;
  const userRole = req.headers['user-role'] || req.body.userRole;

  // Role-based access control
  // Only Admin and Manager can create employee
  if (userRole !== 'Admin' && userRole !== 'Manager') {
    return res.status(403).json({ error: 'Access denied. Only Admins and Managers can create employees.' });
  }

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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Employee created successfully',
      employee_id: results.insertId
    });
  });
});

app.put('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const employee = req.body;
  const userRole = req.headers['user-role'] || req.body.userRole;

  // Role-based access control
  // Only Admin can edit employee information
  if (userRole !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Only Admins can edit employee information.' });
  }

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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const userRole = req.headers['user-role'] || req.body.userRole;

  // Role-based access control
  // Only Admin can delete employees
  if (userRole !== 'Admin') {
    return res.status(403).json({ error: 'Access denied. Only Admins can delete employees.' });
  }

  // Instead of deleting, we mark as inactive
  const query = 'UPDATE employees SET is_active = 0 WHERE employee_id = ?';

  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  });
});

// Department routes
app.get('/api/departments', (req, res) => {
  const query = 'SELECT * FROM departments';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Role routes
app.get('/api/roles', (req, res) => {
  const query = 'SELECT * FROM roles';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Attendance routes
app.get('/api/attendance', (req, res) => {
  const query = 'SELECT a.*, e.first_name, e.last_name FROM attendance a JOIN employees e ON a.employee_id = e.employee_id';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/attendance', (req, res) => {
  const attendance = req.body;
  const query = 'INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, status) VALUES (?, ?, ?, ?, ?)';
  const values = [
    attendance.employee_id,
    attendance.date,
    attendance.check_in_time,
    attendance.check_out_time,
    attendance.status
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating attendance record:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Attendance record created successfully',
      attendance_id: results.insertId
    });
  });
});

// Leave routes
app.get('/api/leaves', (req, res) => {
  const query = 'SELECT lr.*, e.first_name, e.last_name, lt.name as leave_type_name FROM leave_requests lr JOIN employees e ON lr.employee_id = e.employee_id JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching leave requests:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/leaves', (req, res) => {
  const leave = req.body;
  const query = 'INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [
    leave.employee_id,
    leave.leave_type_id,
    leave.start_date,
    leave.end_date,
    leave.reason,
    leave.status || 'Pending'
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating leave request:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Leave request created successfully',
      leave_id: results.insertId
    });
  });
});

app.put('/api/leaves/:id', (req, res) => {
  const leaveId = req.params.id;
  const { status, approved_by, approved_at } = req.body;

  const query = 'UPDATE leave_requests SET status = ?, approved_by = ?, approved_at = ? WHERE leave_id = ?';
  const values = [
    status,
    approved_by,
    approved_at,
    leaveId
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating leave request:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json({ message: 'Leave request updated successfully' });
  });
});

// Payroll routes
app.get('/api/payroll', (req, res) => {
  const query = 'SELECT p.*, e.first_name, e.last_name FROM payroll p JOIN employees e ON p.employee_id = e.employee_id';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching payroll records:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.post('/api/payroll', (req, res) => {
  const payroll = req.body;
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating payroll record:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Payroll record created successfully',
      payroll_id: results.insertId
    });
  });
});

// Leave types route (fixing the bug in LeaveManagement component)
app.get('/api/leave-types', (req, res) => {
  const query = 'SELECT * FROM leave_types';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching leave types:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Store for registered users (in production, this would be in a database)
let registeredUsers = {
  'Srikant': { username: 'Srikant', password: 'test1234', role_name: 'Admin', employee_id: 1, first_name: 'Srikant', last_name: 'Admin' },
  'rajesh.kumar': { username: 'rajesh.kumar', password: 'password123', role_name: 'Manager', employee_id: 1, first_name: 'Rajesh', last_name: 'Kumar' },
  'priya.sharma': { username: 'priya.sharma', password: 'password123', role_name: 'Employee', employee_id: 2, first_name: 'Priya', last_name: 'Sharma' },
  'amit.patel': { username: 'amit.patel', password: 'password123', role_name: 'Manager', employee_id: 3, first_name: 'Amit', last_name: 'Patel' },
  'sneha.reddy': { username: 'sneha.reddy', password: 'password123', role_name: 'Employee', employee_id: 4, first_name: 'Sneha', last_name: 'Reddy' },
  'vikas.singh': { username: 'vikas.singh', password: 'password123', role_name: 'Employee', employee_id: 5, first_name: 'Vikas', last_name: 'Singh' }
};

// Login route for authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = registeredUsers[username];

  if (user && user.password === password) {
    return res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        role_name: user.role_name,
        employee_id: user.employee_id,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

// Signup route for user registration
app.post('/api/signup', async (req, res) => {
  const { username, password, first_name, last_name, email, role_name } = req.body;

  if (!username || !password || !first_name || !last_name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if username already exists
  if (registeredUsers[username]) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  // Create new user
  const newUser = {
    username,
    password,
    role_name: role_name || 'Employee',
    employee_id: Object.keys(registeredUsers).length + 1,
    first_name,
    last_name,
    email
  };

  registeredUsers[username] = newUser;

  return res.status(201).json({
    message: 'User registered successfully',
    user: {
      username: newUser.username,
      role_name: newUser.role_name,
      employee_id: newUser.employee_id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email
    }
  });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
