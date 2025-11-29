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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-header" style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.username}!</p>
        </div>
        <div className="date-display" style={{ color: 'var(--text-light)', fontWeight: 500 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {loading ? (
        <div className="app-loading">Loading dashboard stats...</div>
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>Total Employees</h3>
                <div className="stat-value">{stats.totalEmployees}</div>
                <p>Active employees</p>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>👥</div>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--secondary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>Present Today</h3>
                <div className="stat-value">{stats.presentToday}</div>
                <p>~80% attendance</p>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>✅</div>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: 'var(--accent-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>Pending Leaves</h3>
                <div className="stat-value">{stats.pendingLeaves}</div>
                <p>Requires attention</p>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>📅</div>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#8B5CF6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>Departments</h3>
                <div className="stat-value">{stats.totalDepartments}</div>
                <p>Across organization</p>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.2 }}>🏢</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 className="card-header" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Activity</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#DCFCE7', color: '#166534' }}>✓</span>
              <div>
                <div style={{ fontWeight: 500 }}>Leave request approved</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>John Doe • 2 hours ago</div>
              </div>
            </li>
            <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#DBEAFE', color: '#1E40AF' }}>+</span>
              <div>
                <div style={{ fontWeight: 500 }}>New employee added</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Jane Smith • 5 hours ago</div>
              </div>
            </li>
            <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#FEF3C7', color: '#92400E' }}>$</span>
              <div>
                <div style={{ fontWeight: 500 }}>Payroll processed</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>October 2025 • Yesterday</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 className="card-header" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div className="quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleAddEmployee} style={{ justifyContent: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>+</span> Add New Employee
            </button>
            <button className="btn btn-secondary" onClick={handleMarkAttendance} style={{ justifyContent: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>📝</span> Mark Attendance
            </button>
            <button className="btn btn-secondary" onClick={handleProcessPayroll} style={{ justifyContent: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>💰</span> Process Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
