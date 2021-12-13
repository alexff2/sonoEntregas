import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

const DriverContext = createContext()

export default function DriversProvider({ children }){
  const [ drivers, setDrivers ] = useState([])

  useEffect(() => {
    api.get('users/0')
      .then( resp => setDrivers(resp.data.filter( item => item.OFFICE === 'Driver')))
  },[])

  return(
    <DriverContext.Provider value={{ drivers, setDrivers }}>
      {children}
    </DriverContext.Provider>
  )
}

export function useDrivers(){
  const { drivers, setDrivers } = useContext(DriverContext)
  return { drivers, setDrivers }
}