import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch } from 'react-router-dom'

import DefaultContext from './context/defaultContext'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <DefaultContext>
          <App />
        </DefaultContext>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
