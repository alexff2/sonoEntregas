import React, { createContext, useContext, useState } from 'react'

const BackdropContext = createContext()

export default function BackdropProvider({ children }){
  const [ open, setOpen ] = useState(false)

  return(
    <BackdropContext.Provider value={{ open, setOpen }}>
      {children}
    </BackdropContext.Provider>
  )
}

export function useBackdrop(){
  const { open, setOpen } = useContext(BackdropContext)
  return { open, setOpen }
}