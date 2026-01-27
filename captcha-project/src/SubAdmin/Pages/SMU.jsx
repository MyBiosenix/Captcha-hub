import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import SMUComp from '../Components/SMUComp'
import '../../Citizen/CSSFiles/payment.css'

function SMU() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <SMUComp/>
        </div>
    </div>
  )
}

export default SMU
