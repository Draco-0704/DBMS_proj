import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'Pending'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leave requests
        const leaveResponse = await axios.get('/api/leaves');
        setLeaveRequests(leaveResponse.data);

        // Fetch employees for dropdown
        const employeesResponse = await axios.get('/api/employees');
        setEmployees(employeesResponse.data);

        // Fetch leave types
        const leaveTypesResponse = await axios.get('/api/leave-types');
        setLeaveTypes(leaveTypesResponse.data);
      } catch (err) {

        // Try to fetch leave requests without leave types
        try {
          const leaveResponse = await axios.get('/api/leaves');
          setLeaveRequests(leaveResponse.data);

          const employeesResponse = await axios.get('/api/employees');
          setEmployees(employeesResponse.data);
        } catch (err2) {
          setError('Error fetching data');
          console.error('Error:', err2);
        }
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
      await axios.post('/api/leaves', formData);
      setSuccess('Leave request created successfully');

      // Reset form
      setFormData({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'Pending'
      });

      // Refresh leave requests
      const leaveResponse = await axios.get('/api/leaves');
      setLeaveRequests(leaveResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating leave request');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await axios.put(`/api/leaves/${leaveId}`, {
        status: 'Approved',
        approved_by: 1, // In a real app, this would be the current user's ID
        approved_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });

      setSuccess('Leave request approved successfully');

      // Refresh leave requests
      const leaveResponse = await axios.get('/api/leaves');
      setLeaveRequests(leaveResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error approving leave request');
      console.error('Error:', err);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await axios.put(`/api/leaves/${leaveId}`, {
        status: 'Rejected',
        approved_by: 1, // In a real app, this would be the current user's ID
        approved_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });

      setSuccess('Leave request rejected successfully');

      // Refresh leave requests
      const leaveResponse = await axios.get('/api/leaves');
      setLeaveRequests(leaveResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error rejecting leave request');
      console.error('Error:', err);
    }
  };

  if (loading && !leaveRequests.length && !employees.length && !leaveTypes.length) return <p>Loading leave requests...</p>;

  return (
    <div>
      <h1>Leave Management</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h2 className="card-header">Apply for Leave</h2>
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
            <label htmlFor="leave_type_id">Leave Type *</label>
            <select
              id="leave_type_id"
              name="leave_type_id"
              value={formData.leave_type_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map((leaveType) => (
                <option key={leaveType.leave_type_id} value={leaveType.leave_type_id}>
                  {leaveType.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">Start Date *</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date *</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="card-header">Leave Requests</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.leave_id}>
                  <td>{request.first_name} {request.last_name}</td>
                  <td>{request.leave_type_name}</td>
                  <td>{new Date(request.start_date).toLocaleDateString('en-IN')}</td>
                  <td>{new Date(request.end_date).toLocaleDateString('en-IN')}</td>
                  <td>{request.reason}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === 'Pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(request.leave_id)}
                          style={{ marginRight: '5px' }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(request.leave_id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
