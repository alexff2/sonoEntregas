import React from 'react'

//Providers
import UserProvider from './userContext'
import MaintProvider from './maintContext'
import Alert from './modalAlertContext'
import AuthProvider from './authContext'

export function DefaultProvider({ children }){
  return (
    <Alert>
      <AuthProvider>
        <UserProvider>
          <MaintProvider>
            {children}
          </MaintProvider>
        </UserProvider>
      </AuthProvider>
    </Alert>
  )
}