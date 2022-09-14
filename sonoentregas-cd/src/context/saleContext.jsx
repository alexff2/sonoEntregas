import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

//import { useDate } from './dateContext'

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

  //const { mes, ano } = useDate()

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