import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { makeStyles, Box, Snackbar, Backdrop, CircularProgress } from '@material-ui/core'

//import SetContext from '../context/SetContexts'
import { useAlert } from '../context/alertContext'
import { useAlertSnackbar } from '../context/alertSnackbarContext'
import { useBackdrop } from '../context/backdropContext'

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
  alertWarning: {
    '& .MuiSnackbarContent-root': {
      background: '#FD4659',
    },
  },
  alertSuccess: {
    '& .MuiSnackbarContent-root': {
      background: '#4CAF50',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer * 2,
    color: '#fff',
  },
}))

export default function App(props) {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const { childrenModal, open, setOpen, type } = useAlert()
  const { childrenSnackbar, openSnackbar, setOpenSnackbar, type: typeSnackbar } = useAlertSnackbar()
  const { openBackDrop } = useBackdrop()
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
      <Backdrop
        open={openBackDrop}
        className={classes.backdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
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
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={handleClose}
        message={childrenSnackbar}
        className={typeSnackbar === 'warning' ? classes.alertWarning : classes.alertSuccess}
      />
    </Box>
  )
}
