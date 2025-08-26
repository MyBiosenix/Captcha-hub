import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import SubAdminComp from '../Components/SubAdminComp'
import '../../Citizen/CSSFiles/payment.css'

function ManageSubAdmin() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <SubAdminComp className='groww'/>
        </div>
    </div>
  )
}

export default ManageSubAdmin
