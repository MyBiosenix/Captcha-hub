import React from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import CaptchaFormComp from '../Components/CaptchaFormComp'

function CaptchaForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <CaptchaFormComp/>
      </div>
    </div>
  )
}

export default CaptchaForm
