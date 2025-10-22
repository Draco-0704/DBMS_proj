import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in_time: '',
    check_out_time: '',
    status: 'Present'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attendance records
        const attendanceResponse = await axios.get('/api/attendance');
        setAttendanceRecords(attendanceResponse.data);
        
        // Fetch employees for dropdown
        const employeesResponse = await axios.get('/api/employees');
        setEmployees(employeesResponse.data);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('/api/attendance', formData);
      setSuccess('Attendance record created successfully');
      
      // Reset form
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        check_in_time: '',
        check_out_time: '',
        status: 'Present'
      });
      
      // Refresh attendance records
      const attendanceResponse = await axios.get('/api/attendance');
      setAttendanceRecords(attendanceResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating attendance record');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p className="alert alert-error">{error}</p>;

  return (
    <div>
      <h1>Attendance Management</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="card">
        <h2 className="card-header">Mark Attendance</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employee_id">Employee *</label>
            <select
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.employee_id} value={employee.employee_id}>
                  {employee.first_name} {employee.last_name} - {employee.employee_id}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="check_in_time">Check In Time</label>
            <input
              type="time"
              id="check_in_time"
              name="check_in_time"
              value={formData.check_in_time}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="check_out_time">Check Out Time</label>
            <input
              type="time"
              id="check_out_time"
              name="check_out_time"
              value={formData.check_out_time}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </form>
      </div>
      
      <div className="card">
        <h2 className="card-header">Attendance Records</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={`${record.employee_id}-${record.date}`}>
                  <td>{record.first_name} {record.last_name}</td>
                  <td>{new Date(record.date).toLocaleDateString('en-IN')}</td>
                  <td>{record.check_in_time || 'N/A'}</td>
                  <td>{record.check_out_time || 'N/A'}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
