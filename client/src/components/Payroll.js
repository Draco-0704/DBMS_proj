import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payroll = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    employee_id: '',
    basic_salary: '',
    hra: '',
    da: '',
    medical_allowance: '',
    conveyance_allowance: '',
    other_allowance: '',
    income_tax: '',
    professional_tax: '',
    provident_fund: '',
    other_deductions: '',
    net_salary: '',
    payment_date: new Date().toISOString().split('T')[0],
    payslip_url: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payroll records
        const payrollResponse = await axios.get('/api/payroll');
        setPayrollRecords(payrollResponse.data);
        
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
      await axios.post('/api/payroll', formData);
      setSuccess('Payroll record created successfully');
      
      // Reset form
      setFormData({
        employee_id: '',
        basic_salary: '',
        hra: '',
        da: '',
        medical_allowance: '',
        conveyance_allowance: '',
        other_allowance: '',
        income_tax: '',
        professional_tax: '',
        provident_fund: '',
        other_deductions: '',
        net_salary: '',
        payment_date: new Date().toISOString().split('T')[0],
        payslip_url: ''
      });
      
      // Refresh payroll records
      const payrollResponse = await axios.get('/api/payroll');
      setPayrollRecords(payrollResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating payroll record');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format currency for Indian Rupee
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) return <p>Loading payroll records...</p>;
  if (error) return <p className="alert alert-error">{error}</p>;

  return (
    <div>
      <h1>Payroll Management</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="card">
        <h2 className="card-header">Process Payroll</h2>
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
            <label htmlFor="basic_salary">Basic Salary (INR) *</label>
            <input
              type="number"
              id="basic_salary"
              name="basic_salary"
              value={formData.basic_salary}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hra">HRA (INR)</label>
            <input
              type="number"
              id="hra"
              name="hra"
              value={formData.hra}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="da">Dearness Allowance (INR)</label>
            <input
              type="number"
              id="da"
              name="da"
              value={formData.da}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="medical_allowance">Medical Allowance (INR)</label>
            <input
              type="number"
              id="medical_allowance"
              name="medical_allowance"
              value={formData.medical_allowance}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="conveyance_allowance">Conveyance Allowance (INR)</label>
            <input
              type="number"
              id="conveyance_allowance"
              name="conveyance_allowance"
              value={formData.conveyance_allowance}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="other_allowance">Other Allowance (INR)</label>
            <input
              type="number"
              id="other_allowance"
              name="other_allowance"
              value={formData.other_allowance}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="income_tax">Income Tax (INR)</label>
            <input
              type="number"
              id="income_tax"
              name="income_tax"
              value={formData.income_tax}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="professional_tax">Professional Tax (INR)</label>
            <input
              type="number"
              id="professional_tax"
              name="professional_tax"
              value={formData.professional_tax}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="provident_fund">Provident Fund (INR)</label>
            <input
              type="number"
              id="provident_fund"
              name="provident_fund"
              value={formData.provident_fund}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="other_deductions">Other Deductions (INR)</label>
            <input
              type="number"
              id="other_deductions"
              name="other_deductions"
              value={formData.other_deductions}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="net_salary">Net Salary (INR) *</label>
            <input
              type="number"
              id="net_salary"
              name="net_salary"
              value={formData.net_salary}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="payment_date">Payment Date *</label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="payslip_url">Payslip URL</label>
            <input
              type="text"
              id="payslip_url"
              name="payslip_url"
              value={formData.payslip_url}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Process Payroll'}
          </button>
        </form>
      </div>
      
      <div className="card">
        <h2 className="card-header">Payroll Records</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Payment Date</th>
                <th>Payslip</th>
              </tr>
            </thead>
            <tbody>
              {payrollRecords.map((record) => (
                <tr key={record.payroll_id}>
                  <td>{record.first_name} {record.last_name}</td>
                  <td>{formatCurrency(record.basic_salary)}</td>
                  <td>
                    HRA: {formatCurrency(record.hra)}<br />
                    DA: {formatCurrency(record.da)}<br />
                    Medical: {formatCurrency(record.medical_allowance)}<br />
                    Conveyance: {formatCurrency(record.conveyance_allowance)}<br />
                    Other: {formatCurrency(record.other_allowance)}
                  </td>
                  <td>
                    Income Tax: {formatCurrency(record.income_tax)}<br />
                    Professional Tax: {formatCurrency(record.professional_tax)}<br />
                    PF: {formatCurrency(record.provident_fund)}<br />
                    Other: {formatCurrency(record.other_deductions)}
                  </td>
                  <td>{formatCurrency(record.net_salary)}</td>
                  <td>{new Date(record.payment_date).toLocaleDateString('en-IN')}</td>
                  <td>
                    {record.payslip_url ? (
                      <a href={record.payslip_url} target="_blank" rel="noopener noreferrer">
                        View Payslip
                      </a>
                    ) : (
                      'N/A'
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

export default Payroll;
