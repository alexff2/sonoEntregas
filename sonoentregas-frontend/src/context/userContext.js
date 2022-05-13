import React, { createContext, useContext, useState } from 'react'

const UsersContext = createContext()

export default function UsersProvider({ children }){
  const [ users, setUsers ] = useState([])

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