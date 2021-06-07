import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

const ShopContext = createContext()

export default function ShopProvider({ children }){
  const [ shop, setShop ] = useState([])

  useEffect(()=>{
    api
      .get('conections')
      .then( resp => setShop(resp.data))
  },[])


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