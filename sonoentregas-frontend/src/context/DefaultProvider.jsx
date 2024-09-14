import React from 'react'

//Providers
import UserProvider from './userContext'
import MaintProvider from './maintContext'
import Alert from './modalAlertContext'
import AuthProvider from './authContext'
import BackdropProvider from './backdropContext'

export function DefaultProvider({ children }){
  return (
    <Alert>
      <BackdropProvider>
        <AuthProvider>
          <UserProvider>
            <MaintProvider>
              {children}
            </MaintProvider>
          </UserProvider>
        </AuthProvider>
      </BackdropProvider>
    </Alert>
  )
}