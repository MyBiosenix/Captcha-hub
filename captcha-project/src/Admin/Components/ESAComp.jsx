import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Citizen/CSSFiles/paymentform.css';

function EditSubAdminComp() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingAdmin = location.state?.admin || null;

  const [selectedOption, setSelectedOption] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    if (editingAdmin) {
      setName(editingAdmin.name || '');
      setEmail(editingAdmin.email || '');
      setSelectedOption(editingAdmin.role || '');
    }
  }, [editingAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setRoleError('');

    let valid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name.trim()) {
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

    if (!valid) return;

    try {
      const token = localStorage.getItem('token');

      const res = await axios.put(
        `http://localhost:5035/api/auth/admin/edit-subadmin/${editingAdmin._id}`,
        { name, email, role: selectedOption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating subadmin');
    }
  };

  return (
    <div className='mypf'>
      <div className='fiseforms'>
        <div className='seform'>
          <h2>Edit Sub Admin</h2>
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

            <select 
              value={selectedOption} 
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value='' disabled hidden>
                User Type
              </option>
              <option value='admin'>Admin</option>
            </select>
            {roleError && <p className='error'>{roleError}</p>}
          </div>

          <div className='mybtns'>
            <button 
              className='water-button' 
              type='button' 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              className='water-button2' 
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSubAdminComp;
