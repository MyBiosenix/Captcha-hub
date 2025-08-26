import React, { useState, useEffect } from 'react';
import '../CSSFiles/header.css';
import logo from '../../assets/logo.png';
import mobilelogo from '../../assets/mobilelogo.png';
import profile from '../../assets/profile.png';
import { FiMenu } from 'react-icons/fi';   // <- hamburger icon
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // <- import sidebar

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const [sidebarOpen, setSidebarOpen] = useState(false); // <- state for sidebar

  const navigate = useNavigate();

  const handleLogout = () => {
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
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        <img src={isMobile ? mobilelogo : logo} alt='Logo' className='logo' />

        <div
          className='inheader'
          onClick={() => setShowDropdown(!showDropdown)}
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

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <SideBar />
        </div>
      )}
    </>
  );
}

export default Header;
