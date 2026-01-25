// src/pages/Register.jsx
import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Buyer', // Default role [cite: 43]
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to connect to Express backend and save to Postgres [cite: 110, 112]
    console.log("Registering User:", formData);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Your LiveStockHub Account</h2> [cite: 44]
        <p>Select your role to get started with the marketplace.</p>

        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <label>
              <input 
                type="radio" name="role" value="Seller" 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
              />
              Seller / Farmer
            </label> [cite: 40]
            <label>
              <input 
                type="radio" name="role" value="Buyer" defaultChecked
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
              />
              Buyer / Commercial
            </label> [cite: 41]
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" required placeholder="Enter full name" />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" required placeholder="name@email.com" /> [cite: 4]
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" required placeholder="Secure password" /> [cite: 45]
          </div>

          <button type="submit" className="btn-auth-submit">Create Account</button> [cite: 44]
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Sign In</a> [cite: 44]
        </p>
      </div>
    </div>
  );
};

export default Register;