import React from 'react'

//Providers
import UserProvider from './userContext'
import SalesProcess from './salesProcessContext'
import MaintProvider from './maintContext'
import Alert from './modalAlertContext'
import AuthProvider from './authContext'

export function DefaultProvider({ children }){
  return (
    <Alert>
      <AuthProvider>
        <UserProvider>
          <SalesProcess>
            <MaintProvider>
              {children}
            </MaintProvider>
          </SalesProcess>
        </UserProvider>
      </AuthProvider>
    </Alert>
  )
}