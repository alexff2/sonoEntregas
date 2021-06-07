import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/components/navbar.css'

export default function Navbar(){
  return(
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/sales">Vendas</Link>
      <Link to="/product">Produtos</Link>
      <Link to="/users">Usuários</Link>
    </nav>
  )
}