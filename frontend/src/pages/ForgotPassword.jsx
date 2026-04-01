import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      setInfo('');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email);
    if (!user) {
      setError('No account found for this email. Please register first.');
      setInfo('');
      return;
    }

    const otp = generateOTP();
    const expiration = Date.now() + 5 * 60 * 1000;
    localStorage.setItem('passwordReset', JSON.stringify({ email, otp, expiresAt: expiration }));

    navigate('/reset-password', {
      state: {
        notice: 'A one-time code has been sent to your email address. It is valid for 5 minutes.',
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email to receive a one-time code for password reset.</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Send OTP
          </button>
        </form>

        <div className="auth-footer">
          Remembered your password? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
