import React, { useState } from 'react';
import '../../Admin/CSSFiles/sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUser,
  FiClipboard,
  FiGrid,
  FiUsers,
  FiBox,
} from 'react-icons/fi';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <div className='myside'>
      <div className={`sidediv ${location.pathname === '/sub-admin/dashboard' ? 'active' : ''}`} onClick={() => navigate('/sub-admin/dashboard')}>
        <FiHome className='myicon' />
        <p>Dashboard</p>
      </div>

      <div className={`sidediv ${location.pathname === '/sub-admin/package-type' ? 'active' : ''}`} onClick={() => navigate('/sub-admin/package-type')}>
        <FiGrid className='myicon' />
        <p>Package Type</p>
      </div>

      <div className={`sidediv ${location.pathname === '/sub-admin/manage-user' ? 'active' : ''}`} onClick={() => navigate('/sub-admin/manage-user')}>
        <FiUsers className='myicon' />
        <p>Manage User</p>
      </div>


      <div className={`sidediv ${location.pathname === '/sub-admin/inactive-users' ? 'active' : ''}`} onClick={() => navigate('/sub-admin/inactive-users')}>
        <FiUsers className='myicon' />
        <p>Deactivated Users List</p>
      </div>

      <div className={`sidediv ${location.pathname === '/sub-admin/active-users' ? 'active' : ''}`} onClick={() => navigate('/sub-admin/active-users')}>
        <FiUsers className='myicon' />
        <p>Active Users List</p>
      </div>
    </div>
  );
}

export default SideBar;
