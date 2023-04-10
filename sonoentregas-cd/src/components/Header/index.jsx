import React, { useState } from 'react'
import { 
  AppBar,
  Toolbar,
  makeStyles,
  withStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography
} from '@material-ui/core'
import { AccountCircle, ExitToApp, Assessment } from '@material-ui/icons'

import { useAuthenticate } from '../../context/authContext'
import BtnUpdate from './BtnUpdate'

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    width: `calc(100% - ${256}px)`,
    marginLeft: 256,
  },
  toolbar: {
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
  }
}))

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null)
  const { userAuth, logout } = useAuthenticate()
  const classes = useStyles()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return(
    <AppBar position="fixed" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <BtnUpdate />

        <p className={classes.toolbar}>
          Seja bem vindo(a), 
          <strong>{userAuth.DESCRIPTION}</strong>

          <AccountCircle onClick={handleClick}/>

          <StyledMenu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleCloseMenu}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <Typography variant="inherit" >Relatórios</Typography>
            </MenuItem>
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <Typography variant="inherit" >Sair</Typography>
            </MenuItem>
          </StyledMenu>
        </p>
      </Toolbar>
    </AppBar>
  )
}
