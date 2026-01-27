import React from 'react'
import Header from '../Components/Header'
import '../../Admin/CSSFiles/dashboard.css'
import SideBar from '../Components/SideBar'
import DashComp from '../Components/DashComp'

function SubAdminDashboard() {
  return (
    <div className='dashboard'>
      <Header/>
      <div className='myboard'>
        <SideBar/>
        <DashComp/>
      </div>
    </div>
  )
}

export default SubAdminDashboard
