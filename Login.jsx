import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/context'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, setIsLoggedIn, getuserdata } = useContext(AppContext)

  const [user, setUser] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onsubmitHandler = async (e) => {
    e.preventDefault()
    try {
      axios.defaults.withCredentials = true

      if (user === 'signin') {
        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          { name, email, password }
        )
        if (data.success) {
          setIsLoggedIn(true)
          toast.success("success")
          getuserdata()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          // if server returned token, persist and attach to axios
          if (data.token) {
            localStorage.setItem('token', data.token)
            axios.defaults.headers.common = axios.defaults.headers.common || {}
            axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
          }
          setIsLoggedIn(true)
          getuserdata()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div>
      <img src={assets.logo} onClick={() => navigate('/')} />

      <h2>{user === 'signin' ? 'Create Account' : 'Login'}</h2>

      <form onSubmit={onsubmitHandler}>
        {user === 'signin' && (
          <input
            type="text"
            placeholder="name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{user}</button>

        {user === 'signin' ? (
          <p>
            you already have an account{' '}
            <span onClick={() => setUser('login')}>log-in</span>
          </p>
        ) : (
          <p>
            you dont have account{' '}
            <span onClick={() => setUser('signin')}>sign-in</span>
          </p>
        )}

        <p onClick={() => navigate('/forgotpass')}>forgot password?</p>
      </form>
    </div>
  )
}

export default Login
