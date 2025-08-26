import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import DUComp from '../Components/DUComp'
import '../../Citizen/CSSFiles/payment.css'

function DUserList() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <DUComp/>
        </div>
    </div>
  )
}

export default DUserList
