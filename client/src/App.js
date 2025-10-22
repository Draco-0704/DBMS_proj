import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Attendance from './components/Attendance';
import LeaveManagement from './components/LeaveManagement';
import Payroll from './components/Payroll';
import Navbar from './components/Navbar';
import Login from './components/Login';
import './App.css';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  // If user is not logged in, show login page
  if (!user) {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  // If user is logged in, show the main application
  return (
    <div className="App">
      <Navbar onLogout={handleLogout} user={user} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<LeaveManagement />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
