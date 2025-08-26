import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import '../../Citizen/CSSFiles/payment.css'
import PackageComp from '../Components/PackageComp'

function PackageType() {
  return (
    <div className='mypayment'>
        <Header/>
        <div className='inmypayment'>
            <SideBar/>
            <PackageComp/>
        </div>
    </div>
  )
}

export default PackageType;
