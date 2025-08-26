import React from 'react'
import '../CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import FormComp from '../Components/FormComp'

function PaymentForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <FormComp className='groww'/>
      </div>
    </div>
  )
}

export default PaymentForm
