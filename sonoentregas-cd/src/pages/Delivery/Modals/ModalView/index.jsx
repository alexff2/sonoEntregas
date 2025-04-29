import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Paper,
  TextField
} from "@material-ui/core"

import { ButtonCancel, ButtonSuccess } from '../../../../components/Buttons'

import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

//context
import { useDelivery } from '../../../../context/deliveryContext'
import { useDeliveryFinish } from '../../../../context/deliveryFinishContext'
import { useAlert } from '../../../../context/alertContext'

import api from '../../../../services/api'

const useStyles = makeStyles(theme => ({
  //Style form select\
  titleModalFinish: {
    width: '100%',
    textAlign: 'Center',
    marginTop: -30
  },
  divHeader:{
    width: '100%',
    display: 'flex',
    marginTop: -20,
    marginBottom: 15,
    '& span' : {
      fontWeight: 700
    },
    '& > div': {
      width: '50%',
      '& > p' : {
        marginBottom: 2,
        marginTop: 2,
      },
      '& > div' : {
        marginBottom: 2,
      }
    }
  },
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light
  },
  bodyTab: {
    background: '#FAFAFA',
    border: `1px solid #F7F7F7`,
    minWidth: 771,
    minHeight: 300
  }
}))

export default function ModalView({ setOpen, type, id }){
  //States
  const [ date, setDate ] = useState(false)
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)
  const [ selectDelivery, setSelectDelivery ] = useState()

  const { setDelivery } = useDelivery()
  const { deliveryFinish, setDeliveryFinish } = useDeliveryFinish()
  const { setAlert } = useAlert()

  const classes = useStyles()

  useEffect(() => {
    const loadingData = async () => {
      const { data } = await api.get(`maintenance-delivery/${id}/check-exist-delivery-open`)
      if(data){
        setAlert('Existe uma ou mais assistência em aberto, finalize-a(s) para continuar')
        setOpen(false)
        return
      }

      const { data: delivery } = await api.get(`delivery/${id}/sales/view`)
      type === 'open' && delivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          produto.DELIVERED = true
          produto.STATUS = 'Enviado'
        })
      })
      setSelectDelivery(delivery)
    }

    loadingData()
  }, [type, id, setAlert, setOpen])

  //Functions

  const finish = async () => {
    try {
      if(date){
        setDisabledBtnSave(true)
    
        selectDelivery.STATUS = 'Finalizada'
        selectDelivery['date'] = date
  
        selectDelivery.sales.forEach(sale =>{
          sale.products.forEach(produto => {
            if (produto.QUANTIDADE !== produto.QTD_DELIVERED + produto.QTD_DELIV) produto['UPST'] = false
          })
        })
  
        await api.put(`delivery/status/${selectDelivery.ID}`, selectDelivery)
  
        const { data: deliveriesOpen } = await api.get('delivery/open') 
        setDelivery(deliveriesOpen)
        setDeliveryFinish([...deliveryFinish, selectDelivery])
        setOpen(false)
      } else {
        setAlert('Selecione a data de entrega')
      }
    } catch (error) {
      console.log(error)
      setAlert('Erro de conexão, entrar em contato com ADM')
    }
  }

  //Main Component
  return(
    <form>
      <h3 className={classes.titleModalFinish}>
        { selectDelivery?.DESCRIPTION } - { selectDelivery?.sales.length } Venda(s)
      </h3>

      <div className={classes.divHeader}>    
        <div>
          <p><span>Motorista: </span>{selectDelivery?.DRIVER}</p>
          <p><span>Auxiliar: </span> {selectDelivery?.ASSISTANT}</p>
        </div>

        <div>
          <p><span>Veículo: </span> {selectDelivery?.CAR}</p>
          <p><span>Cubagem: </span> </p>
        </div>

        <div>
          <p><span>Custo: </span> {
            Intl
              .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
              .format(selectDelivery?.COST)
          }</p>
          <p><span>Valor: </span>{
            Intl
            .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
            .format(selectDelivery?.PRICE)
          }</p>
        </div>
      </div>

      {type !== 'close' &&
        <div
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            marginBottom: 4
          }}
        >
          <strong>Data: </strong>
          <TextField 
            type="date"
            required
            onChange={e => setDate(e.target.value)}
          />
        </div>
      }

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHeadSale />

          <TableBody>
            {selectDelivery?.sales.map((sale, index) => (
              <RowSale
                key={index}
                sale={sale}
                classes={classes}
                type={type}
                status={selectDelivery?.STATUS}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {type !== 'close' &&
        <div className={classes.btnActions}>
          <ButtonSuccess 
            children={"Finalizar"}
            onClick={finish}
            disabled={disabledBtnSave}
          />
          <ButtonCancel 
            children="Cancelar"
            onClick={() => setOpen(false)}
            className={classes.btnCancel}
          />
        </div>
      }
    </form>
  )
}