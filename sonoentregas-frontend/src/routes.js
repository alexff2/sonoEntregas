import React from 'react'
import { Route } from 'react-router-dom'

//Providers
import UserProvider from './context/userContext'

//Pages
import Home from './pages/home'
import Users from './pages/Users'
import Sales from './pages/Sales'
import Product from './pages/Product'

export default function Routes(){
  return(
    <main>
      <UserProvider>
        <Route path="/home" exact component={Home}/>
        <Route path="/sales" exact component={Sales}/>
        <Route path="/product" exact component={Product}/>
        <Route path="/users" exact component={Users}/>
        <div className="footer-container"></div>
      </UserProvider>
    </main>
  )
}