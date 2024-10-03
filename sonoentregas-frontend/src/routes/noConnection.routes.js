import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import NoConnection from '../pages/NoConnection'

export default function NoConnectionRoutes(){
  return(
    <Routes>
      <Route path="/no-connection" element={<NoConnection />} />
      <Route path="*" element={<Navigate to="/no-connection"/>} />
    </Routes>
  )
}
