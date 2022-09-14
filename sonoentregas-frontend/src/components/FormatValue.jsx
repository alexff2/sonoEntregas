import React from 'react'

export function FormatValue({ children }){
  return(
    <>
    {
    Intl
      .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
      .format(children)
    }
    </>
  )
}