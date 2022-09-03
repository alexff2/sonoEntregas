import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useAuthenticate } from '../context/authContext' 

import PriveteRoutes from './private.routes'
import PublicRoutes from './public.routes'

export default function Routes(){
  const { isAuthenticated } = useAuthenticate()

  return(
    <BrowserRouter>
      { isAuthenticated ? <PriveteRoutes /> : <PublicRoutes /> }
    </BrowserRouter>
  )
}