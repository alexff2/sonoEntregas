import React, { createContext, useContext, useState } from 'react'

const ModalAlertContext = createContext()

export default function ModalAlertProvider({ children }){
  const [ childrenError, setChildrenError ] = useState('')
  const [ open, setOpen ] = useState(false)
  const [ type, setType ] = useState('')

  return(
    <ModalAlertContext.Provider value={{ childrenError, setChildrenError, open, setOpen, type, setType }}>
      {children}
    </ModalAlertContext.Provider>
  )
}

export function useModalAlert(){
  const { childrenError, setChildrenError, open, setOpen, type, setType } = useContext(ModalAlertContext)
  return { childrenError, setChildrenError, open, setOpen, type, setType }
}