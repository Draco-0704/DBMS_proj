# Employee Management System - Frontend

This is the frontend for the Employee Management System with Indian context, built with React.

## Features

- User authentication (login/logout)
- Dashboard with overview statistics
- Employee management (view, add, edit)
- Attendance tracking
- Leave management
- Payroll management
- Responsive design

## Technologies Used

- React
- React Router DOM
- Axios
- CSS3

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

   This will run the app in development mode on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   ├── Dashboard.js
│   │   ├── EmployeeList.js
│   │   ├── EmployeeForm.js
│   │   ├── Attendance.js
│   │   ├── LeaveManagement.js
│   │   └── Payroll.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Components

### Login
Handles user authentication with username and password.

### Navbar
Navigation bar that shows when user is logged in, with links to all sections and logout button.

### Dashboard
Main overview page showing statistics and quick actions.

### EmployeeList
Displays a table of all employees with options to add new or edit existing employees.

### EmployeeForm
Form for adding new employees or editing existing ones, with validation for Indian-specific fields like Aadhaar and PAN numbers.

### Attendance
Interface for marking and viewing employee attendance records.

### LeaveManagement
System for applying for leave and managing leave requests with approval/rejection functionality.

### Payroll
Payroll processing interface with Indian-specific allowances and deductions.

## Indian Context Features

- Aadhaar number validation (12 digits)
- PAN card validation (10 characters: 5 letters, 4 digits, 1 letter)
- Indian states dropdown in employee forms
- Professional tax field (specific to India)
- House Rent Allowance (HRA) and Dearness Allowance (DA) in payroll
- Indian Rupee (INR) currency formatting
- Indian date formatting

## API Integration

The frontend communicates with the backend API running on [http://localhost:5000](http://localhost:5000).

All API endpoints are prefixed with `/api`:
- `/api/login` - User authentication
- `/api/employees` - Employee management
- `/api/attendance` - Attendance tracking
- `/api/leaves` - Leave management
- `/api/payroll` - Payroll management

## Environment Variables

The frontend doesn't require any environment variables for basic operation, but you can configure the API base URL in `src/App.js`:

```javascript
axios.defaults.baseURL = 'http://localhost:5000';
```

## Browser Support

The application works in all modern browsers that support React.
