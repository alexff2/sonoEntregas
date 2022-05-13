import React from 'react'

//Providers
import UserProvider from './userContext'
import MaintProvider from './mainContext'
import Alert from './modalAlertContext'

export default function DefaultProvider({ children }){
  return (
    <Alert>
      <UserProvider>
        <MaintProvider>
          {children}
        </MaintProvider>
      </UserProvider>
    </Alert>
  )
}