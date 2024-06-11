import React from 'react'
import { Link } from 'react-router-dom'

import './styles.css'

export default function Reports() {

  return (
    <div className='container reports'>
      <h1>Relatórios</h1>

      <div className='report-box'>
        <div className='box'>
          <h2>Relatório de DRE</h2>
          <p>Relatório de Demonstração de Resultados do Exercício</p>
          <Link to={`/report/dre`} target='_blank'>Acessar</Link>
        </div>
      </div>
    </div>
  )
}