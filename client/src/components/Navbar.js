import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Employee Management System</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/employees">Employees</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
        <li><Link to="/leave">Leave</Link></li>
        <li><Link to="/payroll">Payroll</Link></li>
      </ul>
      <div className="navbar-user">
        <span style={{ marginRight: '15px' }}>Welcome, {user?.username || 'User'}</span>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
