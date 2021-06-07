import React from 'react'

import logo from '../img/Sono1.jpeg'

import '../styles/pages/home.css'

export default function Home(){
  return(
    <div className="home">
      <p>Bem vindo!</p>
      <div>
        <img src={logo} alt="Logo" />
      </div>
    </div>
  )
}