import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import '../CSSFiles/login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CitizenLogin() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
      if(password.length<5){
        setPasswordError('Invalid Password');
        valid = false;
      }
      
      if(valid){
        try{
          const res = await axios.post('http://localhost:5035/api/citizen/login',{
            email, password
          });
          alert('Login Succesful');
          localStorage.setItem('token',res.data.token);
          localStorage.setItem('user',JSON.stringify(res.data.user));
          navigate('/citizen/dashboard');
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
    <div className='mylogin'>
      <div className='login'>
        <img src={logo} alt='Logo'/>
        <div className='in-login'>
            <h3>User Login</h3>
            <input type='email' placeholder='Enter Email Id' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            {emailError && <p className='error'>{emailError}</p>}
            <input type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
            {passwordError && <p className='error'>{passwordError}</p>}
        </div>
        <div className='mybtn1'>
            <button onClick={handleLogin}>Login</button>
        </div>
        <p>© 2018 Captcha Hub</p>
      </div>
    </div>
  )
}

export default CitizenLogin
