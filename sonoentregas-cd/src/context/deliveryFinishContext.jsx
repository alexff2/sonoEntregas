import React, { createContext, useState, useContext } from 'react'

const DeliveryFinishContext = createContext()

export default function DeliveryFinishProvider({ children }){
  const [deliveryFinish, setDeliveryFinish] = useState([])

  return (
    <DeliveryFinishContext.Provider
      value={{deliveryFinish, setDeliveryFinish}}
    >
      {children}
    </DeliveryFinishContext.Provider>
  )
}

export function useDeliveryFinish(){
  const {deliveryFinish, setDeliveryFinish} = useContext(DeliveryFinishContext)
  return {deliveryFinish, setDeliveryFinish}
}