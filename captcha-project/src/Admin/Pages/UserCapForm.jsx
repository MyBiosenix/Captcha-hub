import React from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import UCFormComp from '../Components/UCFormComp'

function UserCapForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <UCFormComp/>
      </div>
    </div>
  )
}

export default UserCapForm
