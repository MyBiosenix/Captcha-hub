import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import SDUComp from '../Components/SDUComp'
import '../../Citizen/CSSFiles/payment.css'

function SDU() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <SDUComp/>
        </div>
    </div>
  )
}

export default SDU
