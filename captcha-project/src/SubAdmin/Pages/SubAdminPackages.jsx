import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import '../../Citizen/CSSFiles/payment.css'
import SubPackageComp from '../Components/SubPackageComp'

function SubAdminPackages() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <SubPackageComp/>
        </div>
    </div>
  )
}

export default SubAdminPackages;
