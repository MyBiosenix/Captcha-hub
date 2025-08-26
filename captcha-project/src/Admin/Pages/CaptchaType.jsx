import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import CaptchaComp from '../Components/CaptchaComp'
import '../../Citizen/CSSFiles/payment.css'

function CaptchaType() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <CaptchaComp/>
        </div>
    </div>
  )
}

export default CaptchaType
