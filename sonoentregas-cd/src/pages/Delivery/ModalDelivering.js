import React, { useState } from "react"
import { ButtonSucess } from "../../components/Buttons"
import { makeStyles } from '@material-ui/core'

import api from "../../services/api"
import { useDelivery } from "../../context/deliveryContext"

const useStyle = makeStyles(theme => ({
  errorDiv: {
    fontSize: 15,
    color: theme.palette.common.white,
    background: theme.palette.error.light,
    padding: 5
  }
}))

export default function ModalDelivering({ setOpen, selectDelivery }){
  const [ date, setDate ] = useState('')
  const [ error, setError ] = useState(false)
  const [ childrenError, setChildrenError ] = useState('')
  const { delivery, setDelivery } = useDelivery()

  const { errorDiv } = useStyle()

  const changeDate = e => {
    setError(false)
    
    if (new Date(e.target.value).setHours(0,0,0,0) >= new Date('2021-12-15').setHours(0,0,0,0)) {
      setDate(e.target.value)
    } else {
      e.target.value = ''

      setDate('')

      setError(true)

      setChildrenError('Data não permitida, por favor escolha uma data maior ou igual a hoje')
    }
  }

  const delivering = async () => {
    if (date === '') {
      setError(true)

      setChildrenError('Selecione uma data válida!')
    } else {
      selectDelivery.STATUS = 'Entregando'
      selectDelivery['DATE'] = date
  
      for( let i = 0; i < selectDelivery.sales.length; i++){
        for( let j = 0; j < selectDelivery.sales[i].products.length; j++){
          selectDelivery.sales[i].products[j].STATUS = 'Entregando'
        }
      }
  
      const { data } = await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)
  
      setDelivery(delivery.map( item => item.ID === selectDelivery.ID ? data : item))
  
      setOpen(false)
    }
  }

  return(
    <div>
      <hr />
      Selecione a data de saída: &nbsp;
      <input type="date" onChange={changeDate}/>&nbsp;
      <ButtonSucess children={'SALVAR'} onClick={delivering}/><br/><br/>
      {error && <div className={errorDiv}><span>{childrenError}</span></div>}
    </div>
  )
}