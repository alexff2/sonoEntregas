import React, { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

const AssistantContext = createContext()

export default function AssistantsProvider({ children }){
  const [ assistants, setAssistants ] = useState([])

  useEffect(() => {
    api.get('users/0')
      .then( resp => {
        setAssistants(resp.data.filter( item => item.OFFICE === 'Assistant'))
      })
      .catch(e => alert(e))
  },[])

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