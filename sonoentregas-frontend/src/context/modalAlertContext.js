import React, { createContext, useContext, useState } from 'react'

const ModalAlertContext = createContext()

export default function ModalAlertProvider({ children }){
  const [ childrenError, setChildrenError ] = useState('')
  const [ open, setOpen ] = useState(false)
  const [ type, setType ] = useState('')

  const setAlert = (childrenError, typeAlert = 'error') => {
    childrenError === 'Rede' && (childrenError = 'Erro na conexão com o servidor! Entre em contato com adm da rede (Bruno)!')
    childrenError === 'Servidor' && (childrenError = 'Erro no servidor! entre em contato com ADM do sistema (Alexandre)!')
    setChildrenError(childrenError)
    setOpen(true)
    setType(typeAlert)
  }

  return(
    <ModalAlertContext.Provider value={{ childrenError, setChildrenError, open, setOpen, type, setType, setAlert }}>
      {children}
    </ModalAlertContext.Provider>
  )
}

export function useModalAlert(){
  const { childrenError, setChildrenError, open, setOpen, type, setType, setAlert } = useContext(ModalAlertContext)
  return { childrenError, setChildrenError, open, setOpen, type, setType, setAlert }
}