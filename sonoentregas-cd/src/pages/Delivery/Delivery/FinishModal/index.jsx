import React, {useState, useEffect} from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Paper,
  TextField
} from "@material-ui/core"

import {ButtonCancel, ButtonSuccess} from '../../../../components/Buttons'

import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

import {useDelivery} from '../../../../context/deliveryContext'
import {useDeliveryFinish} from '../../../../context/deliveryFinishContext'
import {useAlert} from '../../../../context/alertContext'

import {getDateSql} from '../../../../functions/getDates'

import api from '../../../../services/api'

const useStyles = makeStyles(theme => ({
  container: {
    maxHeight: 600,
  },
  titleModalFinish: {
    width: '100%',
    textAlign: 'Center',
    marginTop: -30,
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

export default function FinishModal({setOpen, id}){
  //States
  const [date, setDate] = useState('')
  const [disabledBtnSave, setDisabledBtnSave] = useState(false)
  const [selectDelivery, setSelectDelivery] = useState()

  const {setDelivery} = useDelivery()
  const {setDeliveryFinish} = useDeliveryFinish()
  const {setAlert} = useAlert()

  const classes = useStyles()

  const finish = async () => {
    if(!date){
      alert('Preencha a data para finalizar a entrega')
      return
    }

    try {
      setDisabledBtnSave(true)

      await api.put(`delivery/${id}/finish`, {
        date
      })

      const {data: dataDeliveries} = await api.get('delivery/open')
      const {data: dataDeliveriesFinished} = await api.get(`delivery/close/${getDateSql()}`)

      setDelivery(dataDeliveries)
      setDeliveryFinish(dataDeliveriesFinished)
      setOpen(false)
    } catch (error) {
      console.log(error)
      setAlert('Erro de conexão, entrar em contato com ADM')
    }
  }

  const loadingData = React.useCallback(async () => {
    const {data: delivery} = await api.get(`delivery/${id}/sales/view`)
    setSelectDelivery(delivery)
  }, [id])

  useEffect(() => {
    loadingData()
  }, [loadingData])

  return(
    <form>
      <h3 className={classes.titleModalFinish}>
        {selectDelivery?.DESCRIPTION} - {selectDelivery?.sales.length} Venda(s)
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

      <TableContainer component={Paper} className={classes.container}>
        <Table stickyHeader>
          <TableHeadSale />

          <TableBody>
            {selectDelivery?.sales.map((sale, index) => (
              <RowSale
                key={index}
                sale={sale}
                loadingData={loadingData}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </form>
  )
}