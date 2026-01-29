import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/context'
import { toast } from 'react-toastify'

const EmailVerify = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const { backendUrl, getuserdata } = useContext(AppContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    ;(async () => {
      setLoading(true)
      try {
        axios.defaults.withCredentials = true
        const { data } = await axios.post(`${backendUrl}/api/auth/otpverify`, { otp })
        if (data?.success) {
          toast.success(data.message || 'Email verified successfully')
          if (typeof getuserdata === 'function') await getuserdata()
          navigate('/')
        } else {
          toast.error(data?.message || 'Invalid OTP')
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || 'Request failed')
      } finally {
        setLoading(false)
      }
    })()
    console.log(otp)
  }

  return (
    <div>
      <img
        src={assets.logo}
        alt="logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      />

      <form onSubmit={handleSubmit}>
        <h1>Verify Email</h1>
        <p>Enter 6 digit OTP</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
      </form>
    </div>
  )
}

export default EmailVerify
