import React, { createContext, useContext, useState } from 'react'

const CarsContext = createContext()

export default function CarsProvider({ children }){
  const [ cars, setCars ] = useState([])

  return(
    <CarsContext.Provider value={{cars, setCars}}>
      {children}
    </CarsContext.Provider>
  )
}

export function useCars(){
  const { cars, setCars } = useContext(CarsContext)
  return { cars, setCars }
}