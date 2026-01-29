import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/context'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, setIsLoggedIn, setUserData, backendUrl } = useContext(AppContext)

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')

      if (data.success) {
        setIsLoggedIn(false)
        setUserData(null)
        toast.success('Logged out successfully')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed')
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/mailverify')

      if (data.success) {
        toast.success('Verification email sent')
        navigate('/email-verify')   // ✅ CORRECT PATH
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav>
      <img src={assets.logo} alt="logo" onClick={() => navigate('/')} />

      {userData ? (
        <div>
          {userData.name[0].toUpperCase()}
          <ul>
            {!userData.isAccountVerified && (
              <li onClick={sendVerificationOtp}>verify email</li>
            )}
            <li onClick={handleLogout}>logout</li>
          </ul>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </nav>
  )
}

export default Navbar
