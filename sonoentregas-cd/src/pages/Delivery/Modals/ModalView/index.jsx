import React, { useState } from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Paper
} from "@material-ui/core"

import { ButtonCancel, ButtonSuccess } from '../../../../components/Buttons'
import ModalALert from '../../../../components/ModalAlert'

import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

//context
import { useDelivery } from '../../../../context/deliveryContext'
import { useDeliveryFinish } from '../../../../context/deliveryFinishContext'
import { useSale } from '../../../../context/saleContext'

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

export default function ModalView({ setOpen, selectDelivery, type }){
  //States
  const [ openModalAlert, setOpenModalAlert ] = useState(false)
  const [ childrenModalAlert, setChildrenOpenModalAlert ] = useState('')
  const [ dateDelivery, setDateDelivery ] = useState(false)
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)

  const { setDelivery } = useDelivery()
  const { deliveryFinish, setDeliveryFinish } = useDeliveryFinish()
  const stateSales = useSale()

  const classes = useStyles()

  type === 'open' && selectDelivery.sales.forEach(sale =>{
    sale.products.forEach(produto => {
      produto.DELIVERED = true
      produto.STATUS = 'Enviado'
    })
  })

  //Functions

  const finish = async () => {
    try {
      if(dateDelivery){
        setDisabledBtnSave(true)
    
        selectDelivery.STATUS = 'Finalizada'
        selectDelivery['dateDelivery'] = dateDelivery
  
        selectDelivery.sales.forEach(sale =>{
          sale.products.forEach(produto => {
            if (produto.QUANTIDADE !== produto.QTD_DELIVERED + produto.QTD_DELIV) produto['UPST'] = false
          })
        })
  
        const { data } = await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)
  
        if(data.ID){
          const resp = await api.get('sales/', {
            params: {
              status: 'open'
            }
          })
          stateSales.setSales(resp.data)
        }

        const { data: dataDelivery } = await api.get('deliverys/status/') 
        setDelivery(dataDelivery)
        setDeliveryFinish([...deliveryFinish, selectDelivery])
        setOpen(false)
      } else {
        setChildrenOpenModalAlert('Selecione a data de entrega')
        setOpenModalAlert(true)
      }
    } catch (error) {
      console.log(error)
      setChildrenOpenModalAlert('Erro de conexão, entrar em contato com ADM')
      setOpenModalAlert(true)
    }
  }

  //Main Component
  return(
    <form>
      <h3 className={classes.titleModalFinish}>
        { selectDelivery.DESCRIPTION } - { selectDelivery.sales.length } Venda(s)
      </h3>

      <div className={classes.divHeader}>    
        <div>
          <p><span>Motorista: </span>{selectDelivery.DRIVER}</p>
          <p><span>Auxiliar: </span> {selectDelivery.ASSISTANT}</p>
        </div>

        <div>
          <p><span>Veículo: </span> {selectDelivery.CAR}</p>
          {type !== 'close' &&
            <div>
              <span>Data da Entrega: </span>
              <input 
                type="date"
                required
                onChange={e => setDateDelivery(e.target.value)}
              />&nbsp;
            </div>
          }
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHeadSale />

          <TableBody>
            {selectDelivery.sales.map((sale, index) => (
              <RowSale
                key={index}
                sale={sale}
                classes={classes}
                type={type}
                status={selectDelivery.STATUS}
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

      <ModalALert
        open={openModalAlert}
        setOpen={setOpenModalAlert}
        children={childrenModalAlert}
      />
    </form>
  )
}