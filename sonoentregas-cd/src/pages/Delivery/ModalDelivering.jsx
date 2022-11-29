import React, { useState } from "react"
import { ButtonSuccess } from "../../components/Buttons"
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
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)
  const { setDelivery } = useDelivery()
  const { errorDiv } = useStyle()

  const delivering = async () => {
    if (date === '') {
      setError(true)

      setChildrenError('Selecione uma data válida!')
    } else {
      setDisabledBtnSave(true)

      selectDelivery.STATUS = 'Entregando'
      selectDelivery['DATE'] = date
  
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          produto.STATUS = 'Entregando'
          if (produto.QUANTIDADE !== (produto.QTD_DELIVERING + produto.QTD_DELIV)) produto['UPST'] = false
        }
      )})

      await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)

      const {data} = await api.get('deliverys/open')
      setDelivery(data)

      setOpen(false)
    }
  }

  return(
    <div>
      <hr />
      Selecione a data de saída: &nbsp;
      <input type="date" onChange={e => setDate(e.target.value)}/>&nbsp;
      <ButtonSuccess children={'SALVAR'} onClick={delivering} disabled={disabledBtnSave}/><br/><br/>
      {error && <div className={errorDiv}><span>{childrenError}</span></div>}
    </div>
  )
}