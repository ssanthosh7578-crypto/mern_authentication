import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Forgotpass from './Pages/Forgotpass'
import EmailVerify from './Pages/EmailVerify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgotpass' element={<Forgotpass />} />
        <Route path='/email-verify' element={<EmailVerify />} />
      </Routes>
    </div>
  )
}

export default App
