import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Paper,
} from "@material-ui/core"

import RowSale from './RowSale'
import TableHeadSale from './TableHeadSale'

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

export default function ModalView({ id }){
  const [ selectDelivery, setSelectDelivery ] = useState()
  const classes = useStyles()

  useEffect(() => {
    const loadingData = async () => {
      const { data: delivery } = await api.get(`delivery/${id}/sales/view`)
      setSelectDelivery(delivery)
    }

    loadingData()
  }, [id])

  return(
    <div>
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

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHeadSale />

          <TableBody>
            {selectDelivery?.sales.map((sale, index) => (
              <RowSale
                key={index}
                sale={sale}
                status={selectDelivery?.STATUS}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}