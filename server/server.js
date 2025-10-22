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
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_management_system'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.log('Database connection failed. Server will start but database features will not work.');
    // Continue running the server even if database connection fails
  } else {
    console.log('Connected to MySQL database');
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Employee Management System API' });
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

// Login route for authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // For this basic implementation, we'll check against a hardcoded user
  // In a real application, you would check against the database
  if (username === 'Srikant' && password === 'test1234') {
    // Return user data (simplified for this example)
    const user = {
      username: 'Srikant',
      role: 'Admin',
      employee_id: 1
    };
    
    return res.json({ 
      message: 'Login successful', 
      user 
    });
  }
  
  // For other users, we would check the database
  const query = 'SELECT u.*, e.first_name, e.last_name, r.name as role_name FROM users u JOIN employees e ON u.employee_id = e.employee_id JOIN roles r ON u.role_id = r.role_id WHERE u.username = ?';
  
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = results[0];
    
    // For this example, we'll just check the plain text password
    // In a real application, you would use bcrypt to compare hashed passwords
    if (password !== 'password123') { // Using the default password from seed.sql
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Update last login time
    const updateQuery = 'UPDATE users SET last_login = NOW() WHERE user_id = ?';
    db.query(updateQuery, [user.user_id], (err) => {
      if (err) {
        console.error('Error updating last login time:', err);
      }
    });
    
    // Return user data without sensitive information
    const { password_hash, ...userData } = user;
    
    res.json({ 
      message: 'Login successful', 
      user: userData 
    });
  });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
