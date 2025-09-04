import React, { useEffect, useState } from 'react'
import '../CSSFiles/dashboard.css'
import { FiUsers, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import axios from 'axios';

function AdminDashComp() {
    const [ stats, setStats ] = useState({
        totalAdmins:0,
        totalUsers:0,
        activeUsers:0,
        InactiveUsers:0
    });

    const fetchStats = async() => {
        const token = localStorage.getItem('token');
        if(token){
            try{
                const res = await axios.get('https://captcha-hub.onrender.com/api/auth/admin/stats',{
                    headers:{Authorization: `Bearer ${token}`}
                });
                setStats(res.data);
            }
            catch(err){
                console.error(err.message);
                alert('Error Fetching Dashboard Stats');
            }
        }
    }

    useEffect(() => {
        fetchStats()
    },[]);


  return (
    <div className='mydashboard'>
        <h2>Dashboard</h2>
        <div className='indashboard'>
            <div className='icontexts'>
                <FiShield className='one'/>
                <div className='mydoit'>
                    <h4>Total Admins</h4>
                    <h3>{stats.totalAdmins}</h3>
                </div>
            </div>

            <div className='icontexts'>
                <FiUsers className='two'/>
                <div className='mydoit'>
                    <h4>Total Users</h4>
                    <h3>{stats.totalUsers}</h3>
                </div>
            </div>

            <div className='icontexts'>
                <FiUserCheck className='three'/>
                <div className='mydoit'>
                    <h4>Active Users</h4>
                    <h3>{stats.activeUsers}</h3>
                </div>
            </div>

            <div className='icontexts'>
                <FiUserX className='four'/>
                <div className='mydoit'>
                    <h4>Deactivated Users</h4>
                    <h3>{stats.InactiveUsers}</h3>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminDashComp
