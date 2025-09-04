import React, { useEffect, useState } from 'react';
import '../../Citizen/CSSFiles/paymentform.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function UCFormComp() {
  const location = useLocation();
  const navigate = useNavigate();

  const userToEdit = location.state?.userToEdit || null;

  const [captchaLength, setCaptchaLength] = useState('');
  const [captchaDifficulty, setCaptchaDifficulty] = useState('');
  const [sleepTime, setSleepTime] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setCaptchaLength(userToEdit.captchaLength || '');
      setCaptchaDifficulty(userToEdit.captchaDifficulty || '');
      setSleepTime(userToEdit.sleepTime || '');
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // get JWT token

      await axios.put(
        `https://captcha-hub.onrender.com/api/auth/admin/update-captcha-settings/${userToEdit._id}`,
        {
          captchaLength: Number(captchaLength),
          captchaDifficulty: Number(captchaDifficulty),
          sleepTime: Number(sleepTime),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // attach token
          },
        }
      );

      alert('User captcha settings updated successfully');
      navigate('/admin/manage-user');
    } catch (err) {
      console.error('Error updating captcha settings:', err);

      if (err.response?.status === 401) {
        alert('Unauthorized! Please log in again.');
        navigate('/admin/login');
      } else {
        alert('Failed to update captcha settings');
      }
    }
  };

  return (
    <div className="mypf">
      <h2>Edit Captcha Settings</h2>
      <form className="fiseforms" onSubmit={handleSubmit}>
        <div className="fiform">
          <h3>Captcha Settings</h3>
          <div className="in-fiform">
            <div>
              <input
                type="number"
                placeholder="Captcha Length"
                value={captchaLength}
                onChange={(e) => setCaptchaLength(e.target.value)}
                min={4}
                max={10}
                required
              />
            </div>

            <div>
              <input
                type="number"
                placeholder="Captcha Difficulty (0 - 10)"
                value={captchaDifficulty}
                onChange={(e) => setCaptchaDifficulty(e.target.value)}
                min={0}
                max={10}
                required
              />
            </div>

            <div>
              <input
                type="number"
                placeholder="Sleep Time (seconds)"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                min={0}
                required
              />
            </div>
          </div>
        </div>

        <div className="seform">
          <div className="mybtns">
            <button
              type="button"
              className="water-button"
              onClick={() => navigate('/admin/manage-user')}
            >
              Cancel
            </button>
            <button className="water-button2" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UCFormComp;
