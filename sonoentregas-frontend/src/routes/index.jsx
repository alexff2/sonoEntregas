import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useAuthenticate } from '../context/authContext' 

import PrivateRoutes from './private.routes'
import DevelopRoutes from './develop.routes'
import NoConnectionRoutes from './noConnection.routes'
import PublicRoutes from './public.routes'

export default function Routes(){
  const { isAuthenticated, noConnection } = useAuthenticate()

  return(
    <BrowserRouter>
      { isAuthenticated
        ? <>
            { noConnection
              ? <NoConnectionRoutes />
              : <>
                  {
                    process.env.REACT_APP_PASSWORD_DEVELOPER === 'dev'
                    ? <DevelopRoutes />
                    : <PrivateRoutes />
                  }
                </>
            }
          </>
        : <PublicRoutes />
      }
    </BrowserRouter>
  )
}