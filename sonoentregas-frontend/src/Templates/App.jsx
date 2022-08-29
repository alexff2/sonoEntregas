import React from 'react'
import { Outlet } from 'react-router-dom'

import SetContext from '../context/SetContexts'

import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ModalALert2 from '../components/ModalAlert2'

export default function App() {
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
          <ModalALert2 />
        </div>
      </main>

      <Footer />
    </>
  )
}
