import React from 'react'
import Header from '../Components/Header'
import '../CSSFiles/password.css'
import SideBar from '../Components/SideBar'
import ChangePassComp from '../Components/ChangePassComp'

function ChangePass() {
  return (
    <div className='pass'>
      <Header/>
      <div className='mypass'>
        <SideBar/>
        <ChangePassComp/>
      </div>
    </div>
  )
}

export default ChangePass
