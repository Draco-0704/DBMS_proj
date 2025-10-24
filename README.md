# Employee Management System

A comprehensive Employee Management System built with React.js frontend and Node.js/Express.js backend, using MySQL database. This system is designed for Indian companies with features like Aadhaar number, PAN number, and Indian salary structure.

## Features

- **Employee Management**: Add, edit, view, and manage employee records
- **Attendance Tracking**: Mark and track employee attendance
- **Leave Management**: Apply for leave and approve/reject leave requests
- **Payroll Management**: Process payroll with Indian salary components
- **Dashboard**: Overview of key metrics and quick actions
- **Authentication**: Secure login system
- **Indian Context**: Includes Aadhaar, PAN, Indian states, and salary structure

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DBMS_proj-1
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up MySQL database**
   - Start your MySQL server
   - Create a database named `employee_management_system`
   - Or run the setup script:
   ```bash
   npm run setup-db
   ```

4. **Configure environment variables**
   - Create a `.env` file in the server directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=employee_management_system
   PORT=5000
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   npm start
   ```
   or
   ```bash
   cd server && npm start
   ```

2. **Start the frontend client** (in a new terminal)
   ```bash
   npm run client
   ```
   or
   ```bash
   cd client && npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Login Credentials

- **Admin**: Username: `Srikant`, Password: `test1234`
- **Manager**: Username: `rajesh.kumar`, Password: `password123`
- **Employee**: Username: `priya.sharma`, Password: `password123`

## Database Schema

The system includes the following main tables:
- `employees` - Employee personal and professional information
- `departments` - Department information
- `roles` - User roles and permissions
- `users` - Authentication information
- `attendance` - Attendance records
- `leave_requests` - Leave applications
- `leave_types` - Types of leave available
- `payroll` - Salary and payroll information

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (soft delete)

### Departments
- `GET /api/departments` - Get all departments

### Roles
- `GET /api/roles` - Get all roles

### Attendance
- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Create attendance record

### Leave Management
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave request status
- `GET /api/leave-types` - Get all leave types

### Payroll
- `GET /api/payroll` - Get all payroll records
- `POST /api/payroll` - Create payroll record

### Database
- `GET /api/init-db` - Initialize database with schema and seed data

## Project Structure

```
DBMS_proj-1/
├── client/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── server.js          # Main server file
│   └── package.json
├── database/               # Database files
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── setup-database.js      # Database setup script
├── package.json           # Root package.json
└── README.md
```

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL server is running
2. Check database credentials in `.env` file
3. Verify database `employee_management_system` exists
4. Run `npm run setup-db` to initialize database

### Port Issues
- Backend runs on port 5000 by default
- Frontend runs on port 3000 by default
- Change ports in respective package.json files if needed

### CORS Issues
- CORS is configured for `http://localhost:3000`
- Update CORS settings in `server/server.js` if using different ports

## Development

### Adding New Features
1. Create new API endpoints in `server/server.js`
2. Add corresponding React components in `client/src/components/`
3. Update routing in `client/src/App.js`

### Database Changes
1. Update `database/schema.sql` for schema changes
2. Update `database/seed.sql` for sample data changes
3. Run `npm run setup-db` to apply changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.