import React from 'react'
import './style.css'

const NoConnection = () => {
  return (
    <div className="no-connection">
      <div className="container-no-connection">
        <h1>Conexão Perdida</h1>
        <p>Não foi possível conectar ao servidor. Por favor, verifique sua conexão com a internet e tente novamente, ou aguarde até o sistema retornar.</p>
      </div>
    </div>
  )
}

export default NoConnection
