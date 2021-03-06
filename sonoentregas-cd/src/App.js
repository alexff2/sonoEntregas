import React from 'react'
import { CssBaseline, Box } from '@material-ui/core'

import { useAlert } from './context/alertContext'

import ModalALert from './components/ModalAlert'
import Routes from './routes'
import Nav from './components/Nav'
import Header from './components/Header'
import BtnUpdate from './components/BtnUpdate'

function App() {
  const { open, setOpen, childrenModal } = useAlert()
  return (
    <Box display="flex">
      <CssBaseline />
      <BtnUpdate />
      <Header />
      <Nav />
      <Routes />
      <ModalALert children={childrenModal} open={open} setOpen={setOpen}/>
    </Box>
);
}

export default App;
