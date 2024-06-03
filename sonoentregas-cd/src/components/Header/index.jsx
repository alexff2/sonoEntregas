import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  AppBar,
  Toolbar,
  makeStyles,
  withStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  IconButton
} from '@material-ui/core'
import { AccountCircle, ExitToApp, Assessment, Menu as MenuIcon } from '@material-ui/icons'

import { useAuthenticate } from '../../context/authContext'

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
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${256}px)`,
      marginLeft: 256,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
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

export default function Header({ handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { userAuth, logout } = useAuthenticate()
  const classes = useStyles()
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClickReport = () => {
    setAnchorEl(null)
    navigate('/app/reports')
  }

  return(
    <AppBar position="fixed" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <div></div>

        <p className={classes.toolbar}>
          Seja bem vindo(a), 
          <strong>{userAuth.DESCRIPTION}</strong>

          <AccountCircle onClick={handleClick}/>

          <StyledMenu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleClickReport}>
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
