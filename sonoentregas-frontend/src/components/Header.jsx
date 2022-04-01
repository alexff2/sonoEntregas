import React from 'react'
import { useHistory } from "react-router-dom"

import { logout, getUser } from '../services/auth'

import '../styles/components/header.css'

export default function Header(){
  const { NAME } = JSON.parse(getUser())

  const history = useHistory()

  const logoutApp = () => {
    logout()
    history.push('/')
  }
  
  return(
    <header>
      <div className="head-left">
        <h1>Sono &amp; Arte</h1>
        <h2>| ENTREGAS</h2>
      </div>
      <div className="head-rigth">
        <p>Você está conectado como <span>{NAME}</span></p>
        <div className="btn-exit" onClick={logoutApp}>SAIR</div>
      </div>
    </header>
  )
}