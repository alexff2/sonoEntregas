import React, { createContext, useContext, useState } from 'react'

const BackdropContext = createContext()

export default function BackdropProvider({ children }){
  const [openBackDrop, setOpenBackDrop] = useState(false)

  return(
    <BackdropContext.Provider
      value={{
        openBackDrop,
        setOpenBackDrop
      }}
    >
      {children}
    </BackdropContext.Provider>
  )
}

export function useBackdrop(){
  const { openBackDrop, setOpenBackDrop } = useContext(BackdropContext)
  return { openBackDrop, setOpenBackDrop }
}