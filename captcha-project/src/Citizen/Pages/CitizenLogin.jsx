import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import '../CSSFiles/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/citizen/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let valid = true;

    if (!emailRegex.test(email)) {
      setEmailError('Invalid Email Address');
      valid = false;
    }
    if (password.length < 5) {
      setPasswordError('Invalid Password');
      valid = false;
    }

    if (valid) {
      try {
        const res = await axios.post('https://captcha-hub.onrender.com/api/citizen/login', {
          email, password
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        alert('Login Successful');
        navigate('/citizen/dashboard');
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert('Login Failed');
        }
      }
    }
  };

  return (
    <div className='mylogin'>
      <div className='login'>
        <img src={logo} alt='Logo' />
        <div className='in-login'>
          <h3>User Login</h3>
          <div className='in-input'>
            <p>Email Id:</p>
            <input
              type='email'
              placeholder='Enter Email Id'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {emailError && <p className='error'>{emailError}</p>}

          <div className='in-input password-field'>
            <p>Password:</p>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {passwordError && <p className='error'>{passwordError}</p>}
        </div>
        <div className='mybtn1'>
          <button onClick={handleLogin}>Login</button>
        </div>
        <p>© 2018 Captcha Hub</p>
      </div>
    </div>
  );
}

export default CitizenLogin;
