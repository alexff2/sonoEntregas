import React from 'react'

import { useAuthenticate } from '../context/authContext'

import '../styles/components/header.css'

export default function Header(){
  const { userAuth, logout } = useAuthenticate()
  const { DESCRIPTION } = userAuth
  
  return(
    <header>
      <div className="head-left">
        <h1>Sono &amp; Arte</h1>
        <h2>| ENTREGAS</h2>
      </div>
      <div className="head-rigth">
        <p>Você está conectado como <span>{DESCRIPTION}</span></p>
        <div className="btn-exit" onClick={logout}>SAIR</div>
      </div>
    </header>
  )
}