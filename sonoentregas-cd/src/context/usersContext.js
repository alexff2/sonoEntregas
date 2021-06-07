import React, { createContext, useContext, useState, useEffect } from 'react'

import api from '../services/api'

const UsersContext = createContext()

export default function UsersProvider({ children }){
  const [ users, setUsers ] = useState([])

  useEffect(() => {
    api.get('users/0')
      .then( resp => setUsers(resp.data.filter( item => item.OFFICE === 'User')))
      .catch(e => alert(e))
  },[])

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