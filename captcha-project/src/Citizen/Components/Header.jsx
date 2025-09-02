import React, { useState, useEffect } from 'react';
import '../CSSFiles/header.css';
import logo from '../../assets/logo.png';
import mobilelogo from '../../assets/mobilelogo.png';
import profile from '../../assets/profile.png';
import { FiMenu } from 'react-icons/fi';   
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; 
import axios from 'axios'

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const navigate = useNavigate();

  const handleLogout = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.post(
        'https://captcha-hub.onrender.com/api/citizen/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log("Logout error:", err.response?.data || err.message);
    }
  }

  // Only clear after request is done
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/citizen/login');
};


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.name) {
      setUserName(userData.name);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 450);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className='myheader'>
        {isMobile && (
          <FiMenu
          className='menu-icon'
          onClick={() => {
            setShowDropdown(false);           
            setSidebarOpen(prev => !prev);     
          }}
        />
        )}

        <img src={isMobile ? mobilelogo : logo} alt='Logo' className='logo' />

        <div
          className='inheader'
          onClick={() => {
            if (isMobile) setSidebarOpen(false); 
            setShowDropdown((prev) => !prev);   
          }}
        >
          <img src={profile} alt='Profile' className='profile' />
          <p>{userName}<br /><span>Citizen</span></p>

          {showDropdown && (
            <div className='simple-dropdown'>
              <div onClick={() => navigate('/citizen/change-password')}>Change Password</div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <SideBar />
        </div>
      )}
    </>
  );
}

export default Header;
