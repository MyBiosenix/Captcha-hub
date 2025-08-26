import React from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import UserFormComp from '../Components/UserFormComp'

function UserForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <UserFormComp/>
      </div>
    </div>
  )
}

export default UserForm
