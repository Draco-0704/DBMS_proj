-- Employee Management System Seed Data
-- For Indian Context

USE employee_management_system;

-- Insert sample employees
INSERT INTO employees (first_name, last_name, email, phone, date_of_birth, gender, marital_status, address, city, state, pincode, aadhaar_number, pan_number, emergency_contact_name, emergency_contact_phone, department_id, role_id, hire_date) VALUES
('Rajesh', 'Kumar', 'rajesh.kumar@company.com', '9876543210', '1985-05-15', 'Male', 'Married', '123, MG Road', 'Bangalore', 'Karnataka', '560001', '123456789012', 'ABCDE1234F', 'Sunita Kumar', '9876543211', 3, 1, '2020-01-15'),
('Priya', 'Sharma', 'priya.sharma@company.com', '9876543212', '1990-08-22', 'Female', 'Single', '456, Connaught Place', 'New Delhi', 'Delhi', '110001', '234567890123', 'FGHIJ5678K', 'Vikram Sharma', '9876543213', 1, 2, '2021-03-10'),
('Amit', 'Patel', 'amit.patel@company.com', '9876543214', '1988-12-03', 'Male', 'Married', '789, Ellis Bridge', 'Ahmedabad', 'Gujarat', '380006', '345678901234', 'LMNOP9012Q', 'Neha Patel', '9876543215', 3, 2, '2019-07-20'),
('Sneha', 'Reddy', 'sneha.reddy@company.com', '9876543216', '1992-04-18', 'Female', 'Single', '101, Hitech City', 'Hyderabad', 'Telangana', '500081', '456789012345', 'QRSTU3456V', 'Arjun Reddy', '9876543217', 4, 3, '2022-01-05'),
('Vikas', 'Singh', 'vikas.singh@company.com', '9876543218', '1987-09-30', 'Male', 'Married', '202, Salt Lake', 'Kolkata', 'West Bengal', '700091', '567890123456', 'WXYZA7890B', 'Pooja Singh', '9876543219', 2, 3, '2020-11-12'),
('Srikant', 'Admin', 'admin@company.com', '9999999999', '1980-01-01', 'Male', 'Married', 'Admin House', 'Mumbai', 'Maharashtra', '400001', '999999999999', 'ZZZZZ9999Z', 'Admin Contact', '9999999998', 1, 1, '2019-01-01');

-- Insert sample users
-- Passwords:
-- Srikant: test1234 -> $2b$10$P25bdXQQuiEiKgimRx54E.JZG2w2AQo9utST1q1K3fZQ.c855bM3q
-- Others: password123 -> $2b$10$wyzLHBYCzCYpMvNA58v1zedA2O/rY.aS2axnSFIUrYBrrMq2Q4Zo6

INSERT INTO users (employee_id, username, password_hash, role_id) VALUES
(1, 'rajesh.kumar', '$2b$10$wyzLHBYCzCYpMvNA58v1zedA2O/rY.aS2axnSFIUrYBrrMq2Q4Zo6', 1),
(2, 'priya.sharma', '$2b$10$wyzLHBYCzCYpMvNA58v1zedA2O/rY.aS2axnSFIUrYBrrMq2Q4Zo6', 2),
(3, 'amit.patel', '$2b$10$wyzLHBYCzCYpMvNA58v1zedA2O/rY.aS2axnSFIUrYBrrMq2Q4Zo6', 2),
(4, 'sneha.reddy', '$2b$10$wyzLHBYCzCYpMvNA58v1zedA2O/rY.aS2axnSFIUrYBrrMq2Q4Zo6', 3),
(5, 'vikas.singh', '$2b$10$wyzLHBYCzCYpMvNA58v1zedA2O/rY.aS2axnSFIUrYBrrMq2Q4Zo6', 3),
(6, 'Srikant', '$2b$10$P25bdXQQuiEiKgimRx54E.JZG2w2AQo9utST1q1K3fZQ.c855bM3q', 1);

-- Insert sample attendance records for the current month
INSERT INTO attendance (employee_id, date, check_in_time, check_out_time, status) VALUES
(1, '2025-10-01', '09:00:00', '18:00:00', 'Present'),
(1, '2025-10-02', '09:15:00', '18:00:00', 'Late'),
(1, '2025-10-03', '09:00:00', '18:00:00', 'Present'),
(1, '2025-10-04', NULL, NULL, 'Absent'),
(1, '2025-10-05', '09:00:00', '18:00:00', 'Present'),
(2, '2025-10-01', '09:05:00', '17:30:00', 'Present'),
(2, '2025-10-02', '09:00:00', '17:45:00', 'Present'),
(2, '2025-10-03', '09:30:00', '18:00:00', 'Late'),
(2, '2025-10-04', '09:00:00', '17:30:00', 'Present'),
(2, '2025-10-05', '09:00:00', '18:00:00', 'Present'),
(3, '2025-10-01', '09:00:00', '18:15:00', 'Present'),
(3, '2025-10-02', '09:00:00', '18:00:00', 'Present'),
(3, '2025-10-03', '09:00:00', '18:30:00', 'Present'),
(3, '2025-10-04', '09:00:00', '18:00:00', 'Present'),
(3, '2025-10-05', NULL, NULL, 'Absent'),
(4, '2025-10-01', '09:10:00', '17:45:00', 'Present'),
(4, '2025-10-02', '09:00:00', '17:30:00', 'Present'),
(4, '2025-10-03', '09:05:00', '18:00:00', 'Present'),
(4, '2025-10-04', '09:00:00', '17:45:00', 'Present'),
(4, '2025-10-05', '09:00:00', '17:30:00', 'Present'),
(5, '2025-10-01', '09:00:00', '18:00:00', 'Present'),
(5, '2025-10-02', '09:00:00', '18:00:00', 'Present'),
(5, '2025-10-03', '09:00:00', '18:00:00', 'Present'),
(5, '2025-10-04', '09:00:00', '18:00:00', 'Present'),
(5, '2025-10-05', '09:00:00', '18:00:00', 'Present');

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, reason, status, approved_by) VALUES
(4, 1, '2025-10-10', '2025-10-12', 'Personal work', 'Approved', 2),
(4, 2, '2025-10-15', '2025-10-15', 'Fever', 'Pending', NULL),
(5, 1, '2025-10-20', '2025-10-22', 'Family function', 'Rejected', 2),
(3, 3, '2025-11-01', '2025-11-10', 'Earned leave', 'Approved', 1);

-- Insert sample payroll records
INSERT INTO payroll (employee_id, basic_salary, hra, da, medical_allowance, conveyance_allowance, other_allowance, income_tax, professional_tax, provident_fund, other_deductions, net_salary, payment_date) VALUES
(1, 75000.00, 15000.00, 7500.00, 1500.00, 1600.00, 5000.00, 8000.00, 200.00, 9000.00, 0.00, 88400.00, '2025-10-05'),
(2, 60000.00, 12000.00, 6000.00, 1500.00, 1600.00, 3000.00, 5000.00, 200.00, 7200.00, 0.00, 66700.00, '2025-10-05'),
(3, 55000.00, 11000.00, 5500.00, 1500.00, 1600.00, 2500.00, 4500.00, 200.00, 6600.00, 0.00, 60700.00, '2025-10-05'),
(4, 40000.00, 8000.00, 4000.00, 1500.00, 1600.00, 1000.00, 2000.00, 200.00, 4800.00, 0.00, 45500.00, '2025-10-05'),
(5, 45000.00, 9000.00, 4500.00, 1500.00, 1600.00, 1500.00, 2500.00, 200.00, 5400.00, 0.00, 51500.00, '2025-10-05');

