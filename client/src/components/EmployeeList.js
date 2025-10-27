import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('Employee');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role_name || 'Employee');

        const response = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (err) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="alert alert-error">{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Employee List</h1>
        {(userRole === 'Admin' || userRole === 'Manager') && (
          <Link to="/employees/new" className="btn btn-primary">
            Add New Employee
          </Link>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Role</th>
              <th>Hire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.department_name || 'Not assigned'}</td>
                <td>{employee.role_name || 'Not assigned'}</td>
                <td>{new Date(employee.hire_date).toLocaleDateString('en-IN')}</td>
                <td>
                  {userRole === 'Admin' ? (
                    <Link to={`/employees/edit/${employee.employee_id}`} className="btn btn-secondary">
                      Edit
                    </Link>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>View Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
