import React, { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

export default function AlertProvider({ children }){
  const [ open, setOpen ] = useState(false)
  const [ childrenModal, setChildrenModal ] = useState('')

  return(
    <AlertContext.Provider value={{ open, setOpen, childrenModal, setChildrenModal }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert(){
  const { open, setOpen, childrenModal, setChildrenModal } = useContext(AlertContext)
  return { open, setOpen, childrenModal, setChildrenModal }
}