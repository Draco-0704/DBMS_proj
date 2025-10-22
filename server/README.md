# Employee Management System - Backend

This is the backend API for the Employee Management System with Indian context.

## Features

- Employee management (CRUD operations)
- Department management
- Role management
- Attendance tracking
- Leave management
- Payroll management
- Session-based authentication

## Technologies Used

- Node.js
- Express.js
- MySQL2
- Bcrypt (for password hashing)
- Express-session (for session management)
- CORS (for cross-origin resource sharing)
- Body-parser (for parsing request bodies)
- Dotenv (for environment variable management)

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the MySQL database:
   - Create a database named `employee_management_system`
   - Run the schema.sql file to create tables
   - Run the seed.sql file to populate with sample data

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` as needed:
     ```
     DB_HOST=localhost
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=employee_management_system
     SESSION_SECRET=your_session_secret_key
     PORT=5000
     ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/profile` - Get user profile

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (mark as inactive)

### Departments
- `GET /api/departments` - Get all departments

### Roles
- `GET /api/roles` - Get all roles

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Create new attendance record

### Leave
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Create new leave request
- `PUT /api/leaves/:id` - Update leave request status

### Payroll
- `GET /api/payroll` - Get all payroll records
- `POST /api/payroll` - Create new payroll record

## Indian Context Features

- Aadhaar number validation (12 digits)
- PAN card validation (10 characters: 5 letters, 4 digits, 1 letter)
- Indian states dropdown in employee forms
- Professional tax (specific to India)
- House Rent Allowance (HRA) and Dearness Allowance (DA) in payroll
- Indian Rupee (INR) currency formatting

## Database Schema

The database schema is defined in the `database/schema.sql` file in the root directory.

## Sample Data

Sample data for testing is available in the `database/seed.sql` file in the root directory.
