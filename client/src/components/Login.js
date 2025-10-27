import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    role_name: 'Employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/login', {
        username: formData.username,
        password: formData.password
      });
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/signup', formData);
      // Auto login after signup
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignup ? handleSignup : handleLogin;

  return (
    <div className="login-container">
      <h2 className="login-header">Employee Management System</h2>
      <div className="auth-toggle">
        <button
          type="button"
          className={`toggle-btn ${!isSignup ? 'active' : ''}`}
          onClick={() => setIsSignup(false)}
        >
          Login
        </button>
        <button
          type="button"
          className={`toggle-btn ${isSignup ? 'active' : ''}`}
          onClick={() => setIsSignup(true)}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="alert alert-error">{error}</div>}

        {isSignup && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
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
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
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
              <label htmlFor="role_name">Role</label>
              <select
                id="role_name"
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            minLength={6}
          />
          {isSignup && (
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Password must be at least 6 characters
            </small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', marginTop: '10px' }}
        >
          {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}
        </button>
      </form>
    </div>
  );
};

export default Login;
