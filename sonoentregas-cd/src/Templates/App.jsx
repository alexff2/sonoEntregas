import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { makeStyles, Box, Snackbar } from '@material-ui/core'

//import SetContext from '../context/SetContexts'
import { useAlert } from '../context/alertContext'
import { useAlertSnackbar } from '../context/alertSnackbarContext'

import Header from '../components/Header'
import Nav from '../components/Nav'
import ModalALert from '../components/ModalAlert'

const useStyles = makeStyles((theme) => ({
  content: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      width: '100%',
      '& *': {
        fontSize: '10px'
      }
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
      flexGrow: 1
    },
  },
  toolbar: theme.mixins.toolbar,
  alert: {
    '& .MuiSnackbarContent-root': {
      background: '#FD4659',
    },
  }
}))

export default function App(props) {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { childrenModal, open, setOpen, type } = useAlert()
  const { childrenSnackbar, openSnackbar, setOpenSnackbar } = useAlertSnackbar()
  const { window } = props

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false)
  }

  const container = window !== undefined ? () => window().document.body : undefined;

  return(
    <Box display="flex">
      <Header
        handleDrawerToggle={handleDrawerToggle}
      />
      <Nav
        handleDrawerToggle={handleDrawerToggle}
        container={container}
        mobileOpen={mobileOpen}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Outlet />
      </main>
      {open &&
        <ModalALert
          children={childrenModal}
          open={open}
          setOpen={setOpen}
          type={type}
        />
      }
      {
        <Snackbar
          open={openSnackbar}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          autoHideDuration={4000}
          onClose={handleClose}
          message={childrenSnackbar}
          className={classes.alert}
        />
      }
    </Box>
  )
}
