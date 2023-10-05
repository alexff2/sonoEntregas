import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

//Template
import { App, AppExternal } from '../Templates/App'

//Pages
import Home from '../pages/Home'
import Users from '../pages/Users'
import Sales from '../pages/Sales'
import Maintenance from '../pages/Maintenance'
import Product from '../pages/Product'
import Goals from '../pages/Goals'
import Reports from '../pages/Reports'
import ReportsDre from '../pages/Reports/Dre'

export default function PrivateRoutes(){
  return(
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Navigate to="/home" />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/sales" element={<Sales />}/>
        <Route path="/product" element={<Product />}/>
        <Route path="/maintenance" element={<Maintenance />}/>
        <Route path="/users" element={<Users />}/>
        <Route path="/goals" element={<Goals />}/>
        <Route path="/reports" element={<Reports />}/>
        <Route path="*" element={<Navigate to="/"/>} />
      </Route>
      <Route path="/report" element={<AppExternal />}>
        <Route path="/report/dre" element={<ReportsDre />}/>
      </Route>
    </Routes>
  )
}