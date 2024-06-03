import React, { createContext, useState, useContext } from 'react'

const DeliveryContext = createContext()

export default function DeliveryProvider({ children }){
  const [delivery, setDelivery] = useState([])

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