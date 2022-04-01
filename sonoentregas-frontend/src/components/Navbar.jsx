import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/components/navbar.css'

export default function Navbar(){
  const activeLink = e => {
    for (let i = 0; i < e.currentTarget.children.length; i++) {
      e.currentTarget.children[i].classList.remove('active')
    }
    e.target.classList.add('active')
  }

  return(
    <nav onClick={activeLink}>
      <Link to="/home">Home</Link>
      <Link to="/sales">Vendas</Link>
      <Link to="/maintenance">Assistência</Link>
      <Link to="/product">Produtos</Link>
      <Link to="/users">Usuários</Link>
    </nav>
  )
}