import React from 'react'
import { Route } from 'react-router-dom'

//ProviderDefault
import DefaultProvider from './context/DefaultProvider'
import SetContext from './context/SetContexts'

//Components
import Header from './components/Header'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

//Pages
import Home from './pages/Home'
import Users from './pages/Users'
import Sales from './pages/Sales'
import Maintenance from './pages/Maintenance'
import Product from './pages/Product'
import ModalALert2 from './components/ModalAlert2'

export default function Routes(){
  return(
    <DefaultProvider>
      <SetContext />
      <div className="header">
        <Header />
        <Navbar />
      </div>

      <main>
        <Route path="/home" exact component={Home}/>
        <Route path="/sales" exact component={Sales}/>
        <Route path="/product" exact component={Product}/>
        <Route path="/maintenance" exact component={Maintenance}/>
        <Route path="/users" exact component={Users}/>
        <div className="footer-container">
          <ModalALert2 />
        </div>
      </main>
      
      <Footer />
    </DefaultProvider>
  )
}