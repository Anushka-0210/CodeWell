import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hashed = await hashPassword(formData.password);
    const matchedUser = users.find((u) => u.email === formData.email && u.password === hashed);

    if (!matchedUser) {
      setError('Invalid credentials. Please register first or check your email/password.');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ email: matchedUser.email, name: matchedUser.name }));
    onLogin();
    setError('');
    navigate('/');
  };



  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Welcome Back! 👋</h1>
          <p>Login to manage your tasks and wellness</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="developer@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
