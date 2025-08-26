import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import PRComp from '../Components/PRComp'
import '../../Citizen/CSSFiles/payment.css'

function PaymentRequest() {
  return (
    <div className='mypayment'>
      <Header/>
      <div className='inmypayment'>
        <SideBar/>
        <PRComp/>
      </div>
    </div>
  )
}

export default PaymentRequest