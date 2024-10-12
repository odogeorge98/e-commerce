import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminLogin.css'; // Import custom styles

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store the token in local storage
        navigate('/admin/dashboard'); // Navigate to admin dashboard
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Admin Login</h1>
        <p>Enter your credentials to access the admin panel</p>
      </div>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="login-footer">
        <p>
          Not registered as an admin?{' '}
          <Link to="/admin/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
