import React from 'react'

export default function BrMonetaryValue({ value }){
  return (
    <React.Fragment>
      {Intl
          .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
          .format(value)}
    </React.Fragment>
  )
}