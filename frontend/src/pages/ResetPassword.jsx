import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Auth.css';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (location.state?.notice) {
      setInfo(location.state.notice);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address.');
      setInfo('');
      return;
    }

    if (!formData.otp) {
      setError('Please enter the OTP sent to your email.');
      setInfo('');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setInfo('');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setInfo('');
      return;
    }

    const resetData = JSON.parse(localStorage.getItem('passwordReset') || 'null');
    if (!resetData) {
      setError('No active reset request found. Please request a new OTP.');
      setInfo('');
      return;
    }

    if (resetData.email !== formData.email) {
      setError('The email does not match the OTP request.');
      setInfo('');
      return;
    }

    if (resetData.otp !== formData.otp) {
      setError('Invalid OTP. Please check your email and try again.');
      setInfo('');
      return;
    }

    if (Date.now() > resetData.expiresAt) {
      setError('The OTP has expired. Please request a new code.');
      setInfo('');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u) => u.email === formData.email);

    if (userIndex === -1) {
      setError('No account found for this email. Please register first.');
      setInfo('');
      return;
    }

    const hashedPassword = await hashPassword(formData.password);
    users[userIndex].password = hashedPassword;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('passwordReset');

    navigate('/login', {
      state: {
        successMessage: 'Password reset successful. Please login with your new password.',
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email, OTP, and new password to recover access.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {(error || info) && (
            <div className={`auth-error ${info ? 'auth-info' : ''}`}>
              {error || info}
            </div>
          )}

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
            <label htmlFor="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter the 6-digit code"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Reset Password
          </button>
        </form>

        <div className="auth-footer">
          Remembered your password? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
