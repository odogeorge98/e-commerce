import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import '../styles/login.css'; // Ensure to create a corresponding CSS file for styles

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        NotificationManager.success('Login successful');
        navigate('/dashboard'); // Redirect to dashboard upon successful login
      } else {
        const errorData = await response.json();
        NotificationManager.error(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      NotificationManager.error('Login failed');
    }
  };

  return (
    
    <div className="login-container mt-5 pt-5">
      <div className="login-header">
        <h1>Welcome Back!</h1>
        <p>Please enter your credentials to login.</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            value={credentials.email}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            onChange={handleChange}
            value={credentials.password}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
      </form>
      <div className="login-footer mt-3">
        <p>
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
