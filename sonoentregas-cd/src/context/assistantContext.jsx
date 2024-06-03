import React, { createContext, useContext, useState } from 'react'

const AssistantContext = createContext()

export default function AssistantsProvider({ children }){
  const [ assistants, setAssistants ] = useState([])

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