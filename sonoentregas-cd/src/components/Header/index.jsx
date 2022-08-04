import React from 'react'
import { AppBar, Toolbar, makeStyles } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'

import BtnUpdate from './BtnUpdate'

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
    width: `calc(100% - ${256}px)`,
    marginLeft: 256,
  },
  toobar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& strong': {
      margin: '0 5px'
    }
  }
}))

function Header() {
  const classes = useStyles()
  return(
    <AppBar position="fixed" className={classes.root}>
      <Toolbar className={classes.toobar}>
        <BtnUpdate />
        <p className={classes.toobar}>Seja bem vindo(a), <strong>Alexandre</strong><AccountCircle /></p>
      </Toolbar>
    </AppBar>
  )
}

export default Header