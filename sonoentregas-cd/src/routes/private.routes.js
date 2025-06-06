import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import App from '../Templates/App'

import Home from '../pages/Home'

import Delivery from '../pages/Delivery'
import CreateOrUpdate from '../pages/Delivery/Delivery/CreateOrUpdate'
import ForecastCreate from '../pages/Delivery/Forecast/Create'

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
import ExtraRoutesReport from '../pages/Reports/ExtraRoutes'
import PendingProductsOutOfStockReport from '../pages/Reports/PendingProductsOutOfStockReport'

import Maintenance from '../pages/Maintenance'
import Beeping from '../pages/Beeping'

export default function PrivateRoutes(){
  return(
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Navigate to="/app/home"/>} />
        <Route path="/app/home" element={<Home />} />
        <Route path="/app/transports" element={<Cars />} />

        <Route path="/app/delivery" element={<Delivery />} />
        <Route path="/app/delivery/create" element={<CreateOrUpdate />}/>
        <Route path="/app/delivery/:id/update" element={<CreateOrUpdate />}/>
        <Route path="/app/forecast/create/:id" element={<ForecastCreate />}/>

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
        <Route path="/app/reports/extra-routes" element={<ExtraRoutesReport />} />
        <Route path="/app/reports/pending-products-out-of-stock" element={<PendingProductsOutOfStockReport />} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Route>
    </Routes>
  )
}