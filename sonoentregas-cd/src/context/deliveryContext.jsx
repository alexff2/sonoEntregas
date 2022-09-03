import React, { createContext, useState, useContext, useEffect } from 'react'

//import { useDate } from './dateContext'
import api from '../services/api'

const DeliveryContext = createContext()

export default function DeliveryProvider({ children }){
  const [delivery, setDelivery] = useState([])

  useEffect(()=>{
    api.get('deliverys/open').then( resp => setDelivery(resp.data))
  },[])

  return (
    <DeliveryContext.Provider
      value={{delivery, setDelivery}}
    >
      {children}
    </DeliveryContext.Provider>
  )
}

export function useDelivery(){
  const {delivery, setDelivery} = useContext(DeliveryContext)
  return {delivery, setDelivery}
}