import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import External from '../Templates/External'
import NoConnection from '../pages/NoConnection'

export default function NoConnectionRoutes(){
  return(
    <Routes>
      <Route path="/" element={<External />}>
        <Route path="/no-connection" element={<NoConnection />} />
        <Route path="*" element={<Navigate to="/no-connection"/>} />
      </Route>
    </Routes>
  )
}
