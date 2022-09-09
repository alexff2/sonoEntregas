import React, { createContext, useContext, useState } from 'react'

const SalesProcessContext = createContext()

export default function SalesProcessProvider({ children }){
  const [ salesProcess, setSalesProcess ] = useState([])

  return(
    <SalesProcessContext.Provider value={{ salesProcess, setSalesProcess }}>
      {children}
    </SalesProcessContext.Provider>
  )
}

export function useSalesProcess(){
  const { salesProcess, setSalesProcess } = useContext(SalesProcessContext)
  return { salesProcess, setSalesProcess }
}