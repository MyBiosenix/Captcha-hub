import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import MUComp from '../Components/MUComp'
import '../../Citizen/CSSFiles/payment.css'

function ManageUser() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <MUComp/>
        </div>
    </div>
  )
}

export default ManageUser
