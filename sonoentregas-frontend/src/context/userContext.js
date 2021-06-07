import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'
import { getLoja } from '../services/auth'

const UsersContext = createContext()

export default function UsersProvider({ children }){
  const [ errorUsers, setErrorUsers ] = useState()
  const [ users, setUsers ] = useState([])

  const { cod } = JSON.parse(getLoja())

  useEffect(() => {
    api
      .get(`users/${cod}`)
      .then( resp => {
        setUsers(resp.data)
        setErrorUsers(false)
      })
      .catch( error => setErrorUsers(error))
  }, [cod])

  return(
    <UsersContext.Provider value={{ users, setUsers, errorUsers }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers(){
  const { users, setUsers, errorUsers } = useContext(UsersContext)
  return { users, setUsers, errorUsers }
}