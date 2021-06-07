import React, { useContext, createContext, useState } from 'react'

const DateContext = createContext()

export default function DateProvider({ children }){
  const [ date, setDate ] = useState()
  return(
    <DateContext.Provider 
      value={{date, setDate}}
    >{ children }</DateContext.Provider>
  )
}

export function useDate(){
  const { date, setDate } = useContext(DateContext)
  var mes, ano
    if (date) {
      mes = date.mes
      ano = date.ano
    } else {
      const dateAtual = new Date()
      mes = (dateAtual.getMonth() +1)
      ano = dateAtual.getFullYear()
    }
  return { mes, ano, setDate}
}