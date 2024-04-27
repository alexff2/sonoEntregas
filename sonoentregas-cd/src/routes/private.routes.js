import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

//Template
import App from '../Templates/App'

//Pages
import Home from '../pages/Home'
import Delivery from '../pages/Delivery'
import UpdateDelivery from '../pages/Delivery/Update'
import Cars from '../pages/Cars'
import Users from '../pages/Users'
import Products from '../pages/Product'
import Sales from '../pages/Sales'
import Reports from '../pages/Reports'
import OrderSuggestion from '../pages/Reports/OrderSuggestion'
import SalesOpen from '../pages/Reports/SalesOpen'
import PurchaseRequests from '../pages/Reports/PurchaseRequests'
import ProductsMovements from '../pages/Reports/ProductsMovements'
import Maintenance from '../pages/Maintenance'
import Beeping from '../pages/Beeping'
//import Error from './pages/Error'

export default function PrivateRoutes(){
  return(
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Navigate to="/app/home"/>} />
        <Route path="/app/home" element={<Home />} />
        <Route path="/app/transports" element={<Cars />} />
        <Route path="/app/delivery" element={<Delivery />} />
        <Route path="/app/delivery/update/:type/:id" element={<UpdateDelivery />}/>
        <Route path="/app/sales" element={<Sales />} />
        <Route path="/app/products" element={<Products />} />
        <Route path="/app/maintenance" element={<Maintenance />} />
        <Route path="/app/beeping" element={<Beeping />} />
        <Route path="/app/users" element={<Users />} />
        <Route path="/app/reports" element={<Reports />} />
        <Route path="/app/reports/orderSuggestion" element={<OrderSuggestion />} />
        <Route path="/app/reports/salesOpen" element={<SalesOpen />} />
        <Route path="/app/reports/purchaseRequests" element={<PurchaseRequests />} />
        <Route path="/app/reports/products/movement" element={<ProductsMovements />} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Route>
    </Routes>
  )
}