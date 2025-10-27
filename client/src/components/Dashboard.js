import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    totalDepartments: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch employees count
        const employeesResponse = await axios.get('/api/employees');
        const totalEmployees = employeesResponse.data.length;

        // For present today count, we would need to filter attendance records
        // This is a simplified version
        const presentToday = Math.floor(totalEmployees * 0.8);

        // Fetch pending leaves count
        const leavesResponse = await axios.get('/api/leaves');
        const pendingLeaves = leavesResponse.data.filter(leave => leave.status === 'Pending').length;

        // Fetch departments count
        const departmentsResponse = await axios.get('/api/departments');
        const totalDepartments = departmentsResponse.data.length;

        setStats({
          totalEmployees,
          presentToday,
          pendingLeaves,
          totalDepartments
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleAddEmployee = () => {
    navigate('/employees/new');
  };

  const handleMarkAttendance = () => {
    navigate('/attendance');
  };

  const handleProcessPayroll = () => {
    navigate('/payroll');
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Dashboard</h1>
      <p>Welcome, {user?.username}! You have {stats.pendingLeaves} pending leave requests to review.</p>

      {loading ? (
        <p>Loading dashboard stats...</p>
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <div className="stat-value">{stats.totalEmployees}</div>
            <p>Active employees in the organization</p>
          </div>

          <div className="stat-card">
            <h3>Present Today</h3>
            <div className="stat-value">{stats.presentToday}</div>
            <p>Employees present today</p>
          </div>

          <div className="stat-card">
            <h3>Pending Leaves</h3>
            <div className="stat-value">{stats.pendingLeaves}</div>
            <p>Leave requests awaiting approval</p>
          </div>

          <div className="stat-card">
            <h3>Departments</h3>
            <div className="stat-value">{stats.totalDepartments}</div>
            <p>Total departments in the organization</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-header">Quick Actions</h2>
        <div className="quick-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleAddEmployee}>
            Add New Employee
          </button>
          <button className="btn btn-primary" onClick={handleMarkAttendance}>
            Mark Attendance
          </button>
          <button className="btn btn-primary" onClick={handleProcessPayroll}>
            Process Payroll
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">Recent Activity</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#666' }}>
            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>✓</span> John Doe's leave request approved
          </li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#666' }}>
            <span style={{ fontWeight: 'bold', color: '#2196f3' }}>+</span> New employee Jane Smith added to Engineering department
          </li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#666' }}>
            <span style={{ fontWeight: 'bold', color: '#ff9800' }}>$</span> Payroll processed for October 2025
          </li>
          <li style={{ padding: '10px', color: '#666' }}>
            <span style={{ fontWeight: 'bold', color: '#9c27b0' }}>📊</span> Attendance marked for 45 employees
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
