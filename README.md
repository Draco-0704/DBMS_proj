# Employee Management System

A full-stack employee management application built with React (frontend) and Node.js/Express (backend) with MySQL database integration. This system is designed with an Indian context, featuring Indian states, cities, and rupee currency.

## Features

- User authentication (login/logout)
- Employee management (add, edit, delete, view employees)
- Attendance tracking
- Leave management
- Payroll calculation

## Project Structure

```
DBMS_project/
├── client/          # React frontend application
├── server/          # Node.js backend API
├── database/        # Database schema and seed data
├── package.json     # Root package.json (for workspace management)
└── README.md        # This file
```

## Technologies Used

### Frontend (client/)
- React.js
- React Router DOM
- Axios for API requests

### Backend (server/)
- Node.js
- Express.js
- MySQL2
- Dotenv for environment variables
- CORS
- Body-parser

### Database
- MySQL

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/Draco-0704/DBMS_proj.git
   ```

2. Install dependencies for both client and server:
   ```
   cd client
   npm install
   
   cd ../server
   npm install
   ```

3. Set up the database:
   - Create a MySQL database named `employee_management_system`
   - Update the database credentials in `server/.env` file
   - Run the schema and seed files located in the `database/` directory

4. Start the applications:
   ```
   # In server directory
   npm start
   
   # In client directory
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Database Information

This project includes the database schema and initial seed data:
- `database/schema.sql` - Contains the database structure with tables for employees, attendance, leave, payroll, etc.
- `database/seed.sql` - Contains initial data to populate the database

Note: The actual MySQL database files are not included in this repository as they are stored separately on the MySQL server. You'll need to set up a MySQL server and create the database using the provided schema file.

## API Endpoints

The backend provides RESTful APIs for all features:
- Employee management
- Attendance tracking
- Leave requests
- Payroll information

## Contributing

This project was developed as part of a DBMS (Database Management Systems) course project.

## License

MIT License
