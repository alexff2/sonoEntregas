import React from 'react'
import { Outlet } from 'react-router-dom'

import SetContext from '../context/SetContexts'
import { useModalAlert } from '../context/modalAlertContext'

import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ModalALert2 from '../components/ModalAlert2'

export default function App() {
  const { open } = useModalAlert()
  return(
    <>
      <SetContext />
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
