import React, { createContext, useContext, useState, useEffect } from 'react'

import api from '../services/api'

const SaleContext = createContext()

export default function SaleProvider({ children }){
  const [ sales, setSales ] = useState([])

useEffect(()=>{
    api
      .get('sales/', {
        params: {
          status: 'open'
        }
      })
      .then( resp => setSales(resp.data))
  },[])

  return(
    <SaleContext.Provider
      value={{ sales, setSales }}
    >
      {children}
    </SaleContext.Provider>
  )
}

export function useSale(){
  const { sales, setSales } = useContext(SaleContext)
  return {sales, setSales}
}