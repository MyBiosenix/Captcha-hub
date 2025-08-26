import React from 'react'
import Header from '../Components/Header'
import '../../Admin/CSSFiles/password.css'
import SideBar from '../Components/SideBar'
import CUPassComp from '../Components/CUPassComp'

function ChangeUserPass() {
  return (
    <div className='pass'>
      <Header/>
      <div className='mypass'>
        <SideBar/>
        <CUPassComp className='groww'/>
      </div>
    </div>
  )
}

export default ChangeUserPass
