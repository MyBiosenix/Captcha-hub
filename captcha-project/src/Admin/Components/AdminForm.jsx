import React, { useState } from 'react';
import axios from 'axios'; 
import '../../Citizen/CSSFiles/paymentform.css';
import { useNavigate } from 'react-router-dom'

function AdminForm() {
  const [selectedOption, setSelectedOption] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => { 
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setRoleError('');

    let valid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name.trim() === '') {
      setNameError('Name is required');
      valid = false;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    }

    if (!selectedOption) {
      setRoleError('Please select a user type');
      valid = false;
    }

    if (password.length < 5) {
      setPasswordError('Password should be at least 5 characters');
      valid = false;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    if (!valid) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5035/api/auth/admin/add-subadmin',
        { name, email, role: selectedOption, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      setName('');
      setEmail('');
      setSelectedOption('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding subadmin');
    }
  };

  return (
    <div className='mypf'>
      <div className='fiseforms'>
        <div className='seform'>
          <h2>Add Sub Admin</h2>
          <h3>Enter Basic Details</h3>
          <div className='in-seform'>
            <input
              type='text'
              placeholder='Enter Name*'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {nameError && <p className='error'>{nameError}</p>}

            <input
              type='text'
              placeholder='Enter Email Id*'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className='error'>{emailError}</p>}

            <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
              <option value='' disabled hidden>
                User Type
              </option>
              <option value='admin'>Admin</option>
            </select>
            {roleError && <p className='error'>{roleError}</p>}

            <input
              type='password'
              placeholder='Enter Password*'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className='error'>{passwordError}</p>}

            <input
              type='password'
              placeholder='Confirm Password*'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPasswordError && <p className='error'>{confirmPasswordError}</p>}
          </div>

          <div className='mybtns'>
            <button className='water-button' type='button' onClick={() => navigate('/admin/subadmin')}>Cancel</button>
            <button className='water-button2' onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminForm;
