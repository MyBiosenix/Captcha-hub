import React from 'react'
import Header from '../Components/Header'
import '../CSSFiles/dashboard.css'
import SideBar from '../Components/SideBar'
import AdminDashComp from '../Components/AdminDashComp'

function Dashboard() {
  return (
    <div className='dashboard'>
      <Header/>
      <div className='myboard'>
        <SideBar/>
        <AdminDashComp/>
      </div>
    </div>
  )
}

export default Dashboard
