import React, { createContext, useContext, useState } from 'react'

const AlertSnackbarContext = createContext()

export default function AlertProvider({ children }){
  const [ openSnackbar, setOpenSnackbar ] = useState(false)
  const [ childrenSnackbar, setChildrenSnackbar ] = useState('')

  const setAlertSnackbar = childrenError => {
    childrenError === 'Rede' && (childrenError = '◬ Erro na conexão com o servidor! Entre em contato com adm da rede (Bruno)!')
    childrenError === 'Servidor' && (childrenError = '◬ Erro no servidor! entre em contato com ADM do sistema (Alexandre)!')
    setChildrenSnackbar(`◬ ${childrenError}`)
    setOpenSnackbar(true)
  }

  return(
    <AlertSnackbarContext.Provider value={{ openSnackbar, setOpenSnackbar, childrenSnackbar, setAlertSnackbar }}>
      {children}
    </AlertSnackbarContext.Provider>
  )
}

export function useAlertSnackbar(){
  const { openSnackbar, setOpenSnackbar, childrenSnackbar, setAlertSnackbar } = useContext(AlertSnackbarContext)
  return { openSnackbar, setOpenSnackbar, childrenSnackbar, setAlertSnackbar }
}