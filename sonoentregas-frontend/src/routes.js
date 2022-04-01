import React from 'react'
import { Route } from 'react-router-dom'

//Providers
import UserProvider from './context/userContext'
import ModalAlertProvider from './context/modalAlertContext'
import MainProvider from './context/mainContext'

//Pages
import Home from './pages/Home'
import Users from './pages/Users'
import Sales from './pages/Sales'
import Maintenance from './pages/Maintenance'
import Product from './pages/Product'
import ModalALert2 from './components/ModalAlert2'

export default function Routes(){
  return(
    <main>
      <UserProvider>
        <ModalAlertProvider>
          <MainProvider>
            <Route path="/home" exact component={Home}/>
            <Route path="/sales" exact component={Sales}/>
            <Route path="/product" exact component={Product}/>
            <Route path="/maintenance" exact component={Maintenance}/>
            <Route path="/users" exact component={Users}/>
            <div className="footer-container">
              <ModalALert2 />
            </div>
          </MainProvider>
        </ModalAlertProvider>
      </UserProvider>
    </main>
  )
}