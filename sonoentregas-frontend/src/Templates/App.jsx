import React from 'react'
import { Outlet } from 'react-router-dom'

import { useModalAlert } from '../context/modalAlertContext'
import { useBackdrop } from '../context/backdropContext'

import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ModalALert2 from '../components/ModalAlert2'
import Backdrop from '../components/Backdrop'

export function App() {
  const { open } = useModalAlert()
  const { open: openBackdrop } = useBackdrop()
  return(
    <>
      <div className="header">
        <Header />
        <Navbar />
      </div>

      <main>
        <Outlet />
        <div className="footer-container">
          {open && <ModalALert2 />}
          <Backdrop open={openBackdrop}/>
        </div>
      </main>

      <Footer />
    </>
  )
}

export function AppExternal() {
  const { open } = useModalAlert()
  return(
    <>
      <Outlet />
        {open && <ModalALert2 />}
    </>
  )
}
