import React from 'react'

import { getLoja } from '../services/auth'

import '../styles/components/footer.css'

export default function Footer(){
 const {cod, description} = JSON.parse(getLoja())
  return(
    <footer>
      <p>Sono e Arte | Softflex</p>
      <span>Loja: {cod} - {description}</span>
    </footer>
  )
}