import React, { createContext, useContext, useEffect, useState } from 'react'

import { useAuthenticate } from './authContext'

import api from '../services/api'

const UsersContext = createContext()

export default function UsersProvider({ children }){
  const [ users, setUsers ] = useState([])
  const { shopAuth } = useAuthenticate()

  useEffect(() => {
    if (shopAuth.cod) {
      api.get(`/users/${shopAuth.cod}`)
        .then(({ data }) => setUsers(data))
    }
  },[shopAuth])

  return(
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers(){
  const { users, setUsers } = useContext(UsersContext)
  return { users, setUsers }
}