import React from 'react'
import { Outlet } from 'react-router-dom'
import { makeStyles, Box } from '@material-ui/core'

//import SetContext from '../context/SetContexts'
import { useAlert } from '../context/alertContext'

import Header from '../components/Header'
import Nav from '../components/Nav'
import ModalALert from '../components/ModalAlert'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
}))

export default function App() {
  const classes = useStyles()
  const { childrenModal, open, setOpen, type } = useAlert()
  return(
    <Box display="flex">
      <Header />
      <Nav />
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
