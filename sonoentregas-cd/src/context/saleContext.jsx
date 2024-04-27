import React, { createContext, useContext, useState } from 'react'

const SaleContext = createContext()

export default function SaleProvider({ children }){
  const [ sales, setSales ] = useState([])

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