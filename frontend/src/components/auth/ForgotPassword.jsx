import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ForgotPassword = () => {
  const { email } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
  const handleResetPassword = () => {
    axios.put(`${apiBaseUrl}/api/auth/forgot-password/${email}`, { password })
      .then(response => {
        setMessage("Password reset Successfully");
      })
      .catch(error => {
        console.log(error);
        setMessage('Failed to reset password.');
      });
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="mb-4">Forgot Password</h3>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleResetPassword} className="bg-slate-700 text-white p-2 mt-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Reset Password</button>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
        <p className="mt-3 text-center">
          Remember your password? <a href="/sign-in">SignIn</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
