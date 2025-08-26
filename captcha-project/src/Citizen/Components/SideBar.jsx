import React from 'react'
import '../CSSFiles/sidebar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiClipboard, FiSettings } from 'react-icons/fi'

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className='myside'>
        <div className={`sidediv ${location.pathname === '/citizen/dashboard' ? 'active':''}`} onClick={() => navigate('/citizen/dashboard')}>
            <FiHome className='myicon'/>
            <p>Dashboard</p>
        </div>
        <div className={`sidediv ${location.pathname === '/citizen/work' ? 'active': ''}`} onClick={() => navigate('/citizen/work')}>
            <FiClipboard className='myicon'/>
            <p>Captcha Work</p>
        </div>
        <div className={`sidediv ${location.pathname === '/citizen/payment' ? 'active':''}`} onClick={() => navigate('/citizen/payment')}>
            <FiSettings className='myicon'/>
            <p>Payment Request</p>
        </div>
    </div>
  )
}

export default SideBar
