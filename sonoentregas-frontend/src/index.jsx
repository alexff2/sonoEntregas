import React from 'react'
import ReactDOM from 'react-dom'

import './styles/global.css'

import { DefaultProvider } from './context/DefaultProvider'

import Routes from './routes'

ReactDOM.render(
  <DefaultProvider>
    <Routes />
  </DefaultProvider>,
  document.getElementById('root')
)
