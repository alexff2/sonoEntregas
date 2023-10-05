import React from 'react'
import { Outlet } from 'react-router-dom'

import { useModalAlert } from '../context/modalAlertContext'

import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ModalALert2 from '../components/ModalAlert2'

export function App() {
  const { open } = useModalAlert()
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
