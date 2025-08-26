import React from 'react'
import Header from '../Components/Header'
import '../CSSFiles/dashboard.css'
import SideBar from '../Components/SideBar'
import DashComp from '../Components/DashComp'

function Dashboard() {
  return (
    <div className='dashboard'>
      <Header/>
      <div className='myboard'>
        <SideBar/>
        <DashComp className='groww'/>
      </div>
    </div>
  )
}

export default Dashboard
