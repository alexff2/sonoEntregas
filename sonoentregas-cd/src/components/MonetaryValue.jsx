import React from 'react'

export default function MonetaryValue({ children }){
  return (
    <React.Fragment>{children.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</React.Fragment>
  )
}
