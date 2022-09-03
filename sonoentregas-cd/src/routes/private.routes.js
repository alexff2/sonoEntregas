import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

//Template
import App from '../Templates/App'

//Pages
import Home from '../pages/Home'
import Delivery from '../pages/Delivery'
import Cars from '../pages/Cars'
import Users from '../pages/Users'
import Products from '../pages/Product'
import Sales from '../pages/Sales'
import Maintenance from '../pages/Maintenance'
//import Error from './pages/Error'

export default function PriveteRoutes(){
  return(
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Navigate to="/app/home"/>} />
        <Route path="/app/home" element={<Home />} />
        <Route path="/app/transports" element={<Cars />} />
        <Route path="/app/delivery" element={<Delivery />} />
        <Route path="/app/sales" element={<Sales />} />
        <Route path="/app/products" element={<Products />} />
        <Route path="/app/maintenance" element={<Maintenance />} />
        <Route path="/app/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Route>
    </Routes>
  )
}