import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/context'
const Body = () => {
  const { userData } = useContext(AppContext)
  return (
    <div>
        <img src={assets.header_img} alt='logo head'/>
        <h2>{userData?userData.name:"developer"}!welcome to our website<img src={assets.hand_wave} alt='hiimg'/></h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  )
}

export default Body