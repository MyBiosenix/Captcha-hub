import React from 'react'
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import { Navigate } from "react-router-dom";

import CitizenLogin from './Citizen/Pages/CitizenLogin'
import ChangeUserPass from './Citizen/Pages/ChangeUserPass'
import Dashboard from './Citizen/Pages/Dashboard'
import Work from './Citizen/Pages/Work'
import Payment from './Citizen/Pages/Payment'
import PaymentForm from './Citizen/Pages/PaymentForm'

import AdminLogin from './Admin/Pages/AdminLogin'
import ChangePass from './Admin/Pages/ChangePass'
import AdminDashboard from './Admin/Pages/AdminDashboard'
import ManageSubAdmin from './Admin/Pages/ManageSubAdmin'
import AddSAForm from './Admin/Pages/AddSAForm'
import CaptchaType from './Admin/Pages/CaptchaType'
import CaptchaForm from './Admin/Pages/CaptchaForm'
import PackageType from './Admin/Pages/PackageType'
import PackageForm from './Admin/Pages/PackageForm'
import ManageUser from './Admin/Pages/ManageUser'
import UserForm from './Admin/Pages/UserForm'
import EditUser from './Admin/Pages/EditUser'
import UserCapForm from './Admin/Pages/UserCapForm'
import DUserList from './Admin/Pages/DUserList'
import ActiveUsers from './Admin/Pages/ActiveUsers'
import ESAPage from './Admin/Pages/ESAPage'
import PaymentRequest from './Admin/Pages/PaymentRequest'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/citizen/login' element={<CitizenLogin/>}/>
          <Route path="/" element={<Navigate to="/citizen/login" replace />} />
          <Route path='/citizen/change-password' element={<ChangeUserPass/>}/>
          <Route path='/citizen/dashboard' element={<Dashboard/>}/>
          <Route path='/citizen/work' element={<Work/>}/>
          <Route path='/citizen/payment' element={<Payment/>}/>
          <Route path='/citizen/payment-form' element={<PaymentForm/>}/>

          <Route path='/admin/login' element={<AdminLogin/>}/>
          <Route path='/admin/change-password' element={<ChangePass/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin/subadmin' element={<ManageSubAdmin/>}/>
          <Route path='/admin/add-subadmin' element={<AddSAForm/>}/>
          <Route path='/admin/edit-subadmin' element={<ESAPage/>}/>
          <Route path='/admin/captcha-type' element={<CaptchaType/>}/>
          <Route path='/admin/captcha-type/captcha-form' element={<CaptchaForm/>}/>
          <Route path='/admin/package-type' element={<PackageType/>}/>
          <Route path='/admin/package-type/package-form' element={<PackageForm/>}/>
          <Route path='/admin/manage-user' element={<ManageUser/>}/>
          <Route path='/admin/manage-user/add-user' element={<UserForm/>}/>
          <Route path='/admin/payment-request' element={<PaymentRequest/>}/>
          <Route path='/admin/edit-user' element={<EditUser/>}/>
          <Route path='/admin/edit-user/manage-captcha' element={<UserCapForm/>}/>
          <Route path='/admin/deactivated-users' element={<DUserList/>}/>
          <Route path='/admin/active-users' element={<ActiveUsers/>}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App
