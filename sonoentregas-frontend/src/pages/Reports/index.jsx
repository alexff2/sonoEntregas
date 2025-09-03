import React from 'react'
import { Link } from 'react-router-dom'

import { useAuthenticate } from '../../context/authContext'

import './styles.css'

export default function Reports() {
  const [ passwordDev, setPasswordDev ] = React.useState('')
  const { userAuth } = useAuthenticate()

  return (
    <div className='container reports'>
      <h1>Relatórios</h1>

      {
        userAuth.OFFICE === 'Dev' &&
        <input
          type="password"
          style={{
            position: 'absolute',
            top: 0,
            backgroundColor: 'transparent',
            color: 'transparent',
            border: 'transparent',
            outline: 'none',
          }}
          value={passwordDev}
          onChange={e => setPasswordDev(e.target.value)}
        />
      }

      <div className='report-box'>
        { passwordDev === process.env.REACT_APP_PASSWORD_DEVELOPER &&
          <div className='box'>
            <h2>Desenvolvimento</h2>
            <Link to={`/developer/home`}>Acessar</Link>
          </div>
        }
        <div className='box'>
          <h2>Relatório de DRE</h2>
          <p>Relatório de Demonstração de Resultados do Exercício</p>
          <Link to={`/report/dre`} target='_blank'>Acessar</Link>
        </div>
        <div className='box'>
          <h2>Relatório de comissões</h2>
          <p>Relatório de comissões de vendas por faturamento</p>
          <Link to={`/report/sales-commissions`} target='_blank'>Acessar</Link>
        </div>
      </div>
    </div>
  )
}