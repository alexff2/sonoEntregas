import React, { useState } from 'react'
import { AppBar, Toolbar, makeStyles, Box, Paper } from '@material-ui/core'
import { AccountCircle, ExitToApp } from '@material-ui/icons'

import { useAuthenticate } from '../../context/authContext'
import BtnUpdate from './BtnUpdate'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    width: `calc(100% - ${256}px)`,
    marginLeft: 256,
  },
  toobar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',

    '& strong': {
      margin: '0 5px'
    },

    '& > svg': {
      borderRadius: '50%',
      cursor: 'pointer'
    },
    '& > svg:hover': {
      boxShadow: '1px 1px 5px #FFF'
    }
  },
  subMenu: {
    position: 'absolute',
    bottom: -35,
    right: 24,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    cursor: 'pointer',

    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

function Header() {
  const [ subMenu, setSubMenu ] = useState(false)
  const { userAuth, logout } = useAuthenticate()
  const classes = useStyles()

  const openSm = () => {
    setSubMenu(!subMenu)
  }

  return(
    <AppBar position="fixed" className={classes.root}>
      <Toolbar className={classes.toobar}>
        <BtnUpdate />
        <p className={classes.toobar}>
          Seja bem vindo(a), 
          <strong>{userAuth.DESCRIPTION}</strong>
          <AccountCircle onClick={openSm}/>
        </p>

        { subMenu &&
          <Box
            component={Paper}
            className={classes.subMenu}
            onClick={logout}
          >
            Sair
            <ExitToApp/>
          </Box>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Header