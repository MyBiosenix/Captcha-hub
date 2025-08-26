import React from 'react'
import Header from '../Components/Header'
import SideBar from '../Components/SideBar'
import '../CSSFiles/work.css'
import WorkComp from '../Components/WorkComp'

function Work() {
  return (
    <div className='mywork'>
      <Header/>
      <div className='inmywork'>
        <SideBar/>
        <WorkComp className='groww'/>
      </div>
    </div>
  )
}

export default Work
