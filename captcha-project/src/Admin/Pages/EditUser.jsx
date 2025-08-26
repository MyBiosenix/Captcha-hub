import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import EUserComp from '../Components/EUserComp'
import '../../Citizen/CSSFiles/payment.css'

function EditUser() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <EUserComp/>
        </div>
    </div>
  )
}

export default EditUser
