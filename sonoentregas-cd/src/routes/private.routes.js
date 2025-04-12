import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import App from '../Templates/App'

import Home from '../pages/Home'

import Delivery from '../pages/Delivery'
import DeliveryUpdate from '../pages/Delivery/Update'

import Cars from '../pages/Cars'
import Users from '../pages/Users'

import ProductsSearch from '../pages/Product/SearchProducts'
import ProductsPurchaseNotes from '../pages/Product/PurchaseNotes'
import ProductsPurchaseOrder from '../pages/Product/PurchaseOrder'
import ProductsTransfer from '../pages/Product/TransferProducts'
import ProductsChangeBeep from '../pages/Product/ChangeSerialNumber'
import ProductsBalanceByBeep from '../pages/Product/BalanceByBeep'
import ProductsBeepPendantModules from '../pages/Product/BeepPendantModules'

import SalesSearch from '../pages/Sales/Search'
import SalesReturns from '../pages/Sales/Returns'

import Reports from '../pages/Reports'
import OrderSuggestion from '../pages/Reports/OrderSuggestion'
import SalesOpen from '../pages/Reports/SalesOpen'
import PurchaseRequests from '../pages/Reports/PurchaseRequests'
import ProductsMovements from '../pages/Reports/ProductsMovements'
import DeliveriesReport from '../pages/Reports/Deliveries'

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
        <Route path="/app/delivery/update/:type/:id" element={<DeliveryUpdate />}/>

        <Route path="/app/sales/returns" element={<SalesReturns />} />
        <Route path="/app/sales/search" element={<SalesSearch />} />

        <Route path="/app/products/search" element={<ProductsSearch />} />
        <Route path="/app/products/purchase-order" element={<ProductsPurchaseOrder />} />
        <Route path="/app/products/purchase-notes" element={<ProductsPurchaseNotes />} />
        <Route path="/app/products/transfer" element={<ProductsTransfer />} />
        <Route path="/app/products/change-beep" element={<ProductsChangeBeep />} />
        <Route path="/app/products/balance-by-beep" element={<ProductsBalanceByBeep />} />
        <Route path="/app/products/modules-pending-beep" element={<ProductsBeepPendantModules />} />

        <Route path="/app/maintenance" element={<Maintenance />} />
        <Route path="/app/beeping" element={<Beeping />} />
        <Route path="/app/users" element={<Users />} />

        <Route path="/app/reports" element={<Reports />} />
        <Route path="/app/reports/orderSuggestion" element={<OrderSuggestion />} />
        <Route path="/app/reports/salesOpen" element={<SalesOpen />} />
        <Route path="/app/reports/purchaseRequests" element={<PurchaseRequests />} />
        <Route path="/app/reports/products/movement" element={<ProductsMovements />} />
        <Route path="/app/reports/deliveries" element={<DeliveriesReport />} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Route>
    </Routes>
  )
}