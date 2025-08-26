import React, { useState } from 'react';
import '../CSSFiles/sidebar.css';
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

  const token = localStorage.getItem('token');
  const admin = JSON.parse(localStorage.getItem('admin'));
  const role = admin?.role;

  return (
    <div className='myside'>
      <div className={`sidediv ${location.pathname === '/admin/dashboard' ? 'active' : ''}`} onClick={() => navigate('/admin/dashboard')}>
        <FiHome className='myicon' />
        <p>Dashboard</p>
      </div>

      {role === "superadmin" && (
        <>
          <div className={`sidediv ${location.pathname === '/admin/subadmin' ? 'active' : ''}`} onClick={() => navigate('/admin/subadmin')}>
            <FiUser className='myicon' />
            <p>Manage Sub Admin</p>
          </div>
        </>
      )}

      <div className={`sidediv ${location.pathname === '/admin/captcha-type' ? 'active' : ''}`} onClick={() => navigate('/admin/captcha-type')}>
        <FiClipboard className='myicon' />
        <p>Captcha Type</p>
      </div>

      <div className={`sidediv ${location.pathname === '/admin/package-type' ? 'active' : ''}`} onClick={() => navigate('/admin/package-type')}>
        <FiGrid className='myicon' />
        <p>Package Type</p>
      </div>

      <div className={`sidediv ${location.pathname === '/admin/manage-user' ? 'active' : ''}`} onClick={() => navigate('/admin/manage-user')}>
        <FiUsers className='myicon' />
        <p>Manage User</p>
      </div>

      <div className={`sidediv ${location.pathname === '/admin/payment-request' ? 'active' : ''}`} onClick={() => navigate('/admin/payment-request')}>
        <FiBox className='myicon' />
        <p>Payment Request</p>
      </div>


      <div className={`sidediv ${location.pathname === '/admin/edit-user' ? 'active' : ''}`} onClick={() => navigate('/admin/edit-user')}>
        <FiUser className='myicon' />
        <p>Edit User</p>
      </div>

      <div className={`sidediv ${location.pathname === '/admin/deactivated-users' ? 'active' : ''}`} onClick={() => navigate('/admin/deactivated-users')}>
        <FiUsers className='myicon' />
        <p>Deactivated Users List</p>
      </div>

      <div className={`sidediv ${location.pathname === '/admin/active-users' ? 'active' : ''}`} onClick={() => navigate('/admin/active-users')}>
        <FiUsers className='myicon' />
        <p>Active Users List</p>
      </div>
    </div>
  );
}

export default SideBar;
