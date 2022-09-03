import React, { createContext, useContext, useState } from 'react'

const MaintenanceContext = createContext()

export default function MaintenanceProvider({ children }){
  const [ maintenance, setMaintenance ] = useState([])

  return(
    <MaintenanceContext.Provider value={{ maintenance, setMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  )
}

export function useMaintenance(){
  const { maintenance, setMaintenance } = useContext(MaintenanceContext)
  return { maintenance, setMaintenance }
}