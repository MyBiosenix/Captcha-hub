import React, { useState,useEffect } from 'react';
import '../../Admin/CSSFiles/header.css';
import logo from '../../assets/logo.png';
import mobilelogo from '../../assets/mobilelogo.png'
import profile from '../../assets/profile.png';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar'

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('subadmin');
    navigate('/sub-admin/login');
  };
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem('subadmin'));
    console.log(adminData.name)
    if(adminData && adminData.name){
      setAdminName(adminData.name);
    }
    if(adminData && adminData.role){
      setAdminRole(adminData.role);
    }
  },[]);

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
          <p>{adminName}<br /><span>{adminRole}</span></p>

          {showDropdown && (
            <div className='simple-dropdown'>
              <div onClick={() => navigate('/admin/change-password')}>Change Password</div>
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