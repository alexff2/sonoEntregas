import React, { createContext, useState, useContext, useEffect } from 'react'

import api from '../services/api'
import { getDateSql } from '../functions/getDates'

const DeliveryFinishContext = createContext()

export default function DeliveryFinishProvider({ children }){
  const [deliveryFinish, setDeliveryFinish] = useState([])

  useEffect(()=>{
    api.get(`deliverys/close/${getDateSql()}`).then( resp => setDeliveryFinish(resp.data))
  },[])

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