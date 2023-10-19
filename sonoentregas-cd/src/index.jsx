import React from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core'

import DefaultContext from './context/defaultContext'
import Routes from './routes'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#032a5e',
    },
  },
});


ReactDOM.render(
  <ThemeProvider theme={theme}>
    <DefaultContext>
      <CssBaseline />
      <Routes />
    </DefaultContext>
  </ThemeProvider>,
  document.getElementById('root')
)
