import React from 'react'
import '../../Citizen/CSSFiles/paymentform.css'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import PackageFormComp from '../Components/PackageFormComp'

function PackageForm() {
  return (
    <div className='formpage'>
      <Header/>
      <div className='in-formcomp'>
        <SideBar/>
        <PackageFormComp/>
      </div>
    </div>
  )
}

export default PackageForm
