import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function CUPassComp() {
  const [password, setPassword] = useState('');
  const [newpass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [newPassError, setNewPassError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNewPassError('');

    if (!password || !newpass || !confirmPass) {
      alert('All fields are required');
      return;
    }

    if (newpass !== confirmPass) {
      setNewPassError('New password and Confirm password must match');
      return;
    }

    if (newpass.length < 5) {
      setNewPassError('Password must be at least 5 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      const response = await axios.put(
        'https://captcha-hub-1.onrender.com/api/auth/user/change-pass',
        {
          currentPassword: password,
          newPassword: newpass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      setPassword('');
      setNewPass('');
      setConfirmPass('');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <div className='mypassword'>
      <div className='in-mypass'>
        <h2>Change Password</h2>
        <input
          type='password'
          placeholder='Enter Current Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Enter New Password'
          value={newpass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Confirm New Password'
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
        {newPassError && <p className='error'>{newPassError}</p>}
        <div className='mybtns'>
          <button className='water-button' onClick={() => navigate('/citizen/dashboard')}>Cancel</button>
          <button className='water-button2' onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CUPassComp;
