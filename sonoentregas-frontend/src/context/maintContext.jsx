import React, { createContext, useContext, useState } from 'react'

const MainContext = createContext()

export default function MainProvider({ children }){
  const [maintenance, setMaintenance] = useState([])

return (<MainContext.Provider value={{ maintenance, setMaintenance }}>
    { children }
  </MainContext.Provider>)
}

export function useMaintenance(){
  const { maintenance, setMaintenance } = useContext(MainContext)
  return { maintenance, setMaintenance }
}