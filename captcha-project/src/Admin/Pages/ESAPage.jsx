import React from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import ESAComp from '../Components/ESAComp'

function AddSAForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <ESAComp/>
      </div>
    </div>
  )
}

export default AddSAForm
