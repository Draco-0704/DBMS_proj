import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = ({ onLogout, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">EMS</Link>
      </div>
      <ul className="navbar-menu">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li><NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>Employees</NavLink></li>
        <li><NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>Attendance</NavLink></li>
        <li><NavLink to="/leave" className={({ isActive }) => isActive ? 'active' : ''}>Leave</NavLink></li>
        <li><NavLink to="/payroll" className={({ isActive }) => isActive ? 'active' : ''}>Payroll</NavLink></li>
      </ul>
      <div className="navbar-user">
        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.username}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{user?.role_name}</div>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
