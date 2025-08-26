import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import AUserComp from '../Components/AUserComp'
import '../../Citizen/CSSFiles/payment.css'

function ActiveUsers() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <AUserComp/>
        </div>
    </div>
  )
}

export default ActiveUsers
