import React, { createContext, useContext, useState } from 'react'

const AddressContext = createContext()

export default function AddressProvider({ children }){
  const [ address, setAddress ] = useState(false)

  return(
    <AddressContext.Provider
      value={{ address, setAddress }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress(){
  const { address, setAddress } = useContext(AddressContext)
  return {address, setAddress}
}