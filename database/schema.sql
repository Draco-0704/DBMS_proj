-- Employee Management System Database Schema
-- For Indian Context

-- Create database
DROP DATABASE IF EXISTS employee_management_system;
CREATE DATABASE employee_management_system;
USE employee_management_system;

-- Departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    permissions TEXT, -- JSON string containing permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table with Indian-specific fields
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    aadhaar_number VARCHAR(12) UNIQUE, -- Indian Aadhaar card number
    pan_number VARCHAR(10) UNIQUE, -- Indian PAN card number
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    department_id INT,
    role_id INT,
    hire_date DATE,
    termination_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Users table for authentication
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords
    role_id INT,
    last_login TIMESTAMP NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('Present', 'Absent', 'Late', 'Half Day') DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    UNIQUE KEY unique_employee_date (employee_id, date)
);

-- Leave types table
CREATE TABLE leave_types (
    leave_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    max_days_per_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE leave_requests (
    leave_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    leave_type_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_by INT NULL, -- employee_id of approver
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(leave_type_id),
    FOREIGN KEY (approved_by) REFERENCES employees(employee_id)
);

-- Payroll table
CREATE TABLE payroll (
    payroll_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    basic_salary DECIMAL(10, 2) NOT NULL,
    hra DECIMAL(10, 2) DEFAULT 0, -- House Rent Allowance
    da DECIMAL(10, 2) DEFAULT 0, -- Dearness Allowance
    medical_allowance DECIMAL(10, 2) DEFAULT 0,
    conveyance_allowance DECIMAL(10, 2) DEFAULT 0,
    other_allowance DECIMAL(10, 2) DEFAULT 0,
    income_tax DECIMAL(10, 2) DEFAULT 0,
    professional_tax DECIMAL(10, 2) DEFAULT 0, -- Specific to India
    provident_fund DECIMAL(10, 2) DEFAULT 0, -- Employee Provident Fund
    other_deductions DECIMAL(10, 2) DEFAULT 0,
    net_salary DECIMAL(10, 2) NOT NULL,
    payment_date DATE,
    payslip_url VARCHAR(255), -- URL to payslip document
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Insert default roles
INSERT INTO roles (name, permissions) VALUES 
('Admin', '{"can_manage_employees": true, "can_manage_departments": true, "can_approve_leave": true, "can_manage_payroll": true}'),
('Manager', '{"can_manage_employees": true, "can_approve_leave": true}'),
('Employee', '{"can_view_own_profile": true, "can_apply_leave": true}');

-- Insert default departments
INSERT INTO departments (name, description) VALUES 
('Human Resources', 'HR Department'),
('Finance', 'Finance and Accounting Department'),
('Engineering', 'Software Engineering Department'),
('Marketing', 'Marketing and Sales Department'),
('Operations', 'Operations Management Department');

-- Insert default leave types
INSERT INTO leave_types (name, description, max_days_per_year) VALUES 
('Casual Leave', 'Leave for casual purposes', 12),
('Sick Leave', 'Leave for medical reasons', 12),
('Earned Leave', 'Leave earned through service', 20),
('Maternity Leave', 'Leave for maternity purposes', 180),
('Paternity Leave', 'Leave for paternity purposes', 15);
