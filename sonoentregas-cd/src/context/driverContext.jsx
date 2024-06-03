import React, { createContext, useContext, useState } from 'react'

const DriverContext = createContext()

export default function DriversProvider({ children }){
  const [ drivers, setDrivers ] = useState([])

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