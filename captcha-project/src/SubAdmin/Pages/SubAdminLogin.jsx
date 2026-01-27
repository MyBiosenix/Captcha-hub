import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import '../../Admin/CSSFiles/login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SubAdminLogin() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 

    const navigate = useNavigate();

    const handleLogin = async(e) => {
      e.preventDefault();

      setEmailError('');
      setPasswordError('');
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      let valid = true;

      if(!emailRegex.test(email)){
        setEmailError('Invalid Email Address');
        valid = false;
      }
      if(password.length < 5){
        setPasswordError('Invalid Password');
        valid = false;
      }
      
      if(valid){
        try{
          const res = await axios.post('http://localhost:5035/api/sub-admin/login',{
            email, password
          });
          alert('Login Succesful');
          localStorage.setItem('token',res.data.token);
          localStorage.setItem('subadmin',JSON.stringify(res.data.subadmin));
          navigate('/sub-admin/dashboard');
        }
        catch(err){
          if(err.response && err.response.data && err.response.data.message){
            alert(err.response.data.message)
          }
          else{
            alert('Login Failed');
          }
        }
      }
    }

  return (
    <div className='mylogin1'>
      <div className='login1'>
        <img src={logo} alt='Logo'/>
        <div className='in-login1'>
            <h3>Sub-Admin Login</h3>
            <div className='in-input1'>
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

            <div className='in-input password-field1'>
              <p>Password:</p>
              <div className="password-input-wrapper1">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder='Enter Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
                <span 
                  className="toggle-password1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {passwordError && <p className='error'>{passwordError}</p>}
        </div>
        <div className='mybtn11'>
            <button onClick={handleLogin}>Login</button>
        </div>
        <p>© 2018 Captcha Hub</p>
      </div>
    </div>
  )
}

export default SubAdminLogin
