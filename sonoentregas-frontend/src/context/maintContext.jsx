import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

const MainContext = createContext()

export default function MainProvider({ children }){
  const [maintenance, setMaintenance] = useState([])

  useEffect(() => {
    api.get(`maintenance/null`).then(({data}) => setMaintenance(data))
  },[])

return (<MainContext.Provider value={{ maintenance, setMaintenance }}>
    { children }
  </MainContext.Provider>)
}

export function useMaintenance(){
  const { maintenance, setMaintenance } = useContext(MainContext)
  return { maintenance, setMaintenance }
}