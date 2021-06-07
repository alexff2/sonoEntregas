import React, { createContext, useContext, useState, useEffect } from 'react'

import api from '../services/api'

const CarsContext = createContext()

export default function CarsProvider({ children }){
  const [ cars, setCars ] = useState([])

  useEffect(()=>{
    api
      .get('cars')
      .then( resp => setCars(resp.data))
  },[])

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