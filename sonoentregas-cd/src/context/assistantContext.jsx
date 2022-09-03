import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'
import { useAlert } from './alertContext'

const AssistantContext = createContext()

export default function AssistantsProvider({ children }){
  const [ assistants, setAssistants ] = useState([])
  const { setChildrenModal, setOpen } = useAlert()

  useEffect(() => {
    api.get('users/0')
      .then( resp => {
        setAssistants(resp.data.filter( item => item.OFFICE === 'Assistant'))
      })
      .catch(e => {
        setChildrenModal('Erro de conexão, entre em contato com ADM')
        setOpen(true)
        console.log(e)
      })
  },[setChildrenModal, setOpen])

  return(
    <AssistantContext.Provider value={{ assistants, setAssistants }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistants(){
  const { assistants, setAssistants } = useContext(AssistantContext)
  return { assistants, setAssistants }
}