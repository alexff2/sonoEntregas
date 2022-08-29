import React from 'react'
import ReactDOM from 'react-dom'

import DefaultContext from './context/defaultContext'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <DefaultContext>
      <div>Teste</div>
    </DefaultContext>
  </React.StrictMode>,
  document.getElementById('root')
)
