import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar_number: '',
    pan_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    department_id: '',
    role_id: '',
    hire_date: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep', 'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const departmentsResponse = await axios.get('/api/departments');
        setDepartments(departmentsResponse.data);
        
        // Fetch roles
        const rolesResponse = await axios.get('/api/roles');
        setRoles(rolesResponse.data);
        
        // If editing, fetch employee data
        if (id) {
          const employeeResponse = await axios.get(`/api/employees/${id}`);
          setFormData({
            ...employeeResponse.data,
            date_of_birth: employeeResponse.data.date_of_birth?.split('T')[0],
            hire_date: employeeResponse.data.hire_date?.split('T')[0]
          });
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      if (id) {
        // Update existing employee
        await axios.put(`/api/employees/${id}`, formData);
        setSuccess('Employee updated successfully');
      } else {
        // Create new employee
        await axios.post('/api/employees', formData);
        setSuccess('Employee created successfully');
      }
      
      // Redirect to employee list after 1 second
      setTimeout(() => {
        navigate('/employees');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving employee');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !departments.length && !roles.length) return <p>Loading form...</p>;

  return (
    <div className="form-container">
      <h1>{id ? 'Edit Employee' : 'Add New Employee'}</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name *</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="last_name">Last Name *</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth *</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="marital_status">Marital Status *</label>
          <select
            id="marital_status"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            required
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="aadhaar_number">Aadhaar Number *</label>
          <input
            type="text"
            id="aadhaar_number"
            name="aadhaar_number"
            value={formData.aadhaar_number}
            onChange={handleChange}
            maxLength="12"
            pattern="[0-9]{12}"
            title="Aadhaar number must be 12 digits"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pan_number">PAN Number *</label>
          <input
            type="text"
            id="pan_number"
            name="pan_number"
            value={formData.pan_number}
            onChange={handleChange}
            maxLength="10"
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            title="PAN number must be 10 characters: 5 uppercase letters, 4 digits, 1 uppercase letter"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="state">State *</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="pincode">Pincode *</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            pattern="[0-9]{6}"
            title="Pincode must be 6 digits"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="emergency_contact_name">Emergency Contact Name *</label>
          <input
            type="text"
            id="emergency_contact_name"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="emergency_contact_phone">Emergency Contact Phone *</label>
          <input
            type="tel"
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="department_id">Department *</label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.department_id} value={department.department_id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="role_id">Role *</label>
          <select
            id="role_id"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="hire_date">Hire Date *</label>
          <input
            type="date"
            id="hire_date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ marginRight: '10px' }}
          >
            {loading ? 'Saving...' : 'Save Employee'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/employees')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
