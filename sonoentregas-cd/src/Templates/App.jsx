import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { makeStyles, Box } from '@material-ui/core'

//import SetContext from '../context/SetContexts'
import { useAlert } from '../context/alertContext'

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
}))

export default function App(props) {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { childrenModal, open, setOpen, type } = useAlert()
  const { window } = props

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
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
        />}
    </Box>
  )
}
