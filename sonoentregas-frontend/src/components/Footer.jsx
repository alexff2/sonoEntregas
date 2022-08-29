import React from 'react'

import { useAuthenticate } from '../context/authContext'

import '../styles/components/footer.css'

export default function Footer(){
  const { shopAuth } = useAuthenticate()

  const { cod, description } = shopAuth

  return(
    <footer>
      <p>Sono e Arte | Softflex</p>
      <span>Loja: {cod} - {description}</span>
    </footer>
  )
}