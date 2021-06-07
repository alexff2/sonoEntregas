import React from 'react'
import { AppBar, Toolbar,makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
    width: `calc(100% - ${256}px)`,
    marginLeft: 256,
  }
}))

function Header() {
  const classes = useStyles()
  return(
    <AppBar position="fixed" className={classes.root}>
      <Toolbar></Toolbar>
    </AppBar>
  )
}

export default Header