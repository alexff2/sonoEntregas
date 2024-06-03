import React, { createContext, useContext, useState } from 'react'

const ShopContext = createContext()

export default function ShopProvider({ children }){
  const [ shop, setShop ] = useState([])

  return(
    <ShopContext.Provider
      value={{ shop, setShop }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop(){
  const { shop, setShop } = useContext(ShopContext)
  return {shop, setShop}
}