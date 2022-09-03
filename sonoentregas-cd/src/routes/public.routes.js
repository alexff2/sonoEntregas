import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import External from '../Templates/External'
import Login from '../pages/Login'

export default function PublicRoutes(){
  return(
    <Routes>
      <Route path="/" element={<External />}>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Route>
    </Routes>
  )
}