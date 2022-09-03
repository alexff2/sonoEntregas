import React, { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

export default function AlertProvider({ children }){
  const [ open, setOpen ] = useState(false)
  const [ childrenModal, setChildrenModal ] = useState('')
  const [ type, setType ] = useState('')

  const setAlert = (childrenError, typeAlert = 'error') => {
    childrenError === 'Rede' && (childrenError = 'Erro na conexão com o servidor! Entre em contato com adm da rede (Bruno)!')
    childrenError === 'Servidor' && (childrenError = 'Erro no servidor! entre em contato com ADM do sistema (Alexandre)!')
    setChildrenModal(childrenError)
    setOpen(true)
    setType(typeAlert)
  }

  return(
    <AlertContext.Provider value={{ open, setOpen, childrenModal, setAlert, type }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert(){
  const { open, setOpen, childrenModal, setAlert, type } = useContext(AlertContext)
  return { open, setOpen, childrenModal, setAlert, type }
}