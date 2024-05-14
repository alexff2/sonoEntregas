import React, { useState } from "react"
import { ButtonSuccess } from "../../../components/Buttons"
import {
  makeStyles,
  TextField,
  Divider,
  Box
} from '@material-ui/core'

import { useDelivery } from "../../../context/deliveryContext"
import { useAlert } from '../../../context/alertContext'

import api from "../../../services/api"

const useStyle = makeStyles(theme => ({
  errorDiv: {
    fontSize: 15,
    color: theme.palette.common.white,
    background: theme.palette.error.light,
    padding: 8
  },
  boxContainer: {
    width: 500,
    marginTop: 20,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    '& > span' : {
      fontWeight: 'bold'
    }
  }
}))

export default function ModalDelivering({ setOpen, selectDelivery }){
  const [ date, setDate ] = useState('')
  const [ error, setError ] = useState(false)
  const [ childrenError, setChildrenError ] = useState('')
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)

  const classes = useStyle()
  const { setDelivery } = useDelivery()
  const { setAlert } = useAlert()

  const delivering = async () => {
    try {
      if (date === '') {
        setError(true)
  
        setChildrenError('Selecione uma data válida!')

        return
      }

      setDisabledBtnSave(true)

      selectDelivery.STATUS = 'Entregando'
      selectDelivery['date'] = date
  
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          produto.STATUS = 'Entregando'
          if (produto.QUANTIDADE !== (produto.QTD_DELIVERING + produto.QTD_DELIV)) produto['UPST'] = false
        }
      )})

      await api.put(`delivery/status/${selectDelivery.ID}`, selectDelivery)

      const {data} = await api.get('delivery/open')
      setDelivery(data)

      setOpen(false)
    } catch (e) {
      setDisabledBtnSave(false)

      if (!e.response){
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)
        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
  }

  return(
    <div>
      <Divider />
      <Box className={classes.boxContainer}>
        <span>Selecione a data de saída:</span>
        <TextField
          type="date"
          onChange={e => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />

        <ButtonSuccess
          children={'SALVAR'}
          onClick={delivering}
          disabled={disabledBtnSave}
          loading={disabledBtnSave}
        />
      </Box>
      {error && <div className={classes.errorDiv}><span>{childrenError}</span></div>}
    </div>
  )
}