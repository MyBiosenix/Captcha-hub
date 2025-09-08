import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../Citizen/CSSFiles/paymentform.css'
import axios from 'axios'

function CaptchaFormComp() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const captchaToEdit = location.state?.captchaToEdit || null;

  const [captcha, setCaptcha] = useState('');

  useEffect(() => {
    if (captchaToEdit) {
      setCaptcha(captchaToEdit.captcha);
    }
  }, [captchaToEdit]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captcha.trim() === "") {
      alert('Captcha Type is Required');
      return;
    }

    try {
      if (captchaToEdit) {
        await axios.put(`https://captcha-hub-1.onrender.com/api/auth/edit-captcha/${captchaToEdit._id}`, { captcha });
        alert('Captcha Type Updated Successfully');
      } else {
        await axios.post('https://captcha-hub-1.onrender.com/api/auth/captcha-type', { captcha });
        alert('Captcha Type Added Successfully');
      }
      setCaptcha('');
      navigate('/admin/captcha-type');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving Captcha');
    }
  };

  return (
    <div className='mypf'>
      <div className='fiseforms'>
        <div className='seform'>
          <h2>{captchaToEdit ? 'Edit Captcha Type' : 'Add Captcha Type'}</h2>
          
          <div className='in-seform'>
            <input 
              type='text' 
              placeholder='Enter Name*' 
              value={captcha} 
              onChange={(e) => setCaptcha(e.target.value)} 
              required
            />
          </div>

          <div className='mybtns'>
            <button className='water-button' onClick={() => navigate('/admin/captcha-type')}>Cancel</button>
            <button className='water-button2' onClick={handleSubmit}>
              {captchaToEdit ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptchaFormComp
