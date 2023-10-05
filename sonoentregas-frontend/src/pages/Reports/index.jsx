import React from 'react'

import './styles.css'

export default function Reports() {

  return (
    <div className="container reports">
      <h1>Relatórios</h1>

      <div className="report-box">
        <div className="box">
          <h2>Relatório de DRE</h2>
          <p>Relatório de Demonstração de Resultados do Exercício</p>
          <a href={`${process.env.REACT_APP_BASE_URL_FRONT}/report/dre`} target="_blank" rel="noopener noreferrer">Acessar</a>
        </div>
      </div>
    </div>
  )
}