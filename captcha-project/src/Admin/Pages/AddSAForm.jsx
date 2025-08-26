import React from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import AdminForm from '../Components/AdminForm'

function AddSAForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <AdminForm/>
      </div>
    </div>
  )
}

export default AddSAForm
