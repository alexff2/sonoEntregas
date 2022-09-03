import React from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@material-ui/core'


import DefaultContext from './context/defaultContext'
import Routes from './routes'

ReactDOM.render(
  <DefaultContext>
    <CssBaseline />
    <Routes />
  </DefaultContext>,
  document.getElementById('root')
)
