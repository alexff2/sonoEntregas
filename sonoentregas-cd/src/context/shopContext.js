import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

const ShopContext = createContext()

export default function ShopProvider({ children }){
  const [ shop, setShop ] = useState([])

  useEffect(()=>{
    api
      .get('conections')
      .then( resp => {
        resp.data &&
        setShop([{database: "SONOENTREGAS"},
          {database: "SONO"},
          {database: "SONO_JP1"},
          {database: "SONO_JP2"},
          {database: "RIO_ANIL"},
          {database: "S_ILHA"},
          {database: "COHAB"},
          {database: "SONO_PN"}
        ])
      })
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