import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import SAUComp from '../Components/SAUComp'
import '../../Citizen/CSSFiles/payment.css'

function SAU() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <SAUComp/>
        </div>
    </div>
  )
}

export default SAU
