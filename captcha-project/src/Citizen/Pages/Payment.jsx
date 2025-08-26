import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import PaymentComp from '../Components/PaymentComp'
import '../CSSFiles/payment.css'

function Payment() {
  return (
    <div className='mypayment'>
      <Header/>
      <div className='inmypayment'>
        <SideBar/>
        <PaymentComp className='groww'/>
      </div>
    </div>
  )
}

export default Payment