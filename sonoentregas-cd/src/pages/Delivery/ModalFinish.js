import React, { useState } from "react"
import {
  makeStyles,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Paper
} from "@material-ui/core"

import { ButtonCancel, ButtonSucess } from '../../components/Buttons'

import getDate from '../../functions/getDates'

//context
import { useCars } from '../../context/carsContext'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'
import { useDelivery } from '../../context/deliveryContext'
import { useSale } from '../../context/saleContext'

import api from '../../services/api'

const useStyles = makeStyles(theme => ({
  //Style form select\
  divHeader:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '-20px'
  },
  divDateDelivery: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: '1rem'
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
  tableHead: {
    background: theme.palette.primary.main
  },
  tableHeadCell: {
    textAlign: 'end',
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  tableHeadCellStart:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  }
}))

const Row = ({ sale, sendSalesProd, classes }) => {
  return(
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          {sale.ID_SALES}
        </TableCell>
        <TableCell>{sale.NOMECLI}</TableCell>
        <TableCell align="right">{
          Intl
          .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
          .format(sale.TOTAL)
        }</TableCell>
        <TableCell align="right">{getDate(sale.EMISSAO)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Produtos
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Qtd. Entrega</TableCell>
                  <TableCell align="right">Valor (R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.products.map((produto) => (
                  <TableRow key={produto.CODPRODUTO}>
                    <TableCell component="th" scope="row">
                      {produto.CODPRODUTO}
                    </TableCell>
                    <TableCell>{produto.DESCRICAO}</TableCell>
                    <TableCell>{produto.QTD_DELIV}</TableCell>
                    <TableCell align="right">{
                      Intl
                        .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
                        .format(produto.NVTOTAL)
                    }</TableCell>
                    <TableCell align="right">
                    <Checkbox
                      onChange={(e) => sendSalesProd(e, produto)}
                    />
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function ModalFinish({ setOpen, selectDelivery, currentDeliv, setCurrentDeliv}){
  //States
  const [ dateDelivery, setDateDelivery ] = useState(false)
  
  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { delivery, setDelivery } = useDelivery()
  const stateSales = useSale()

  //Styes
  const classes = useStyles()
  
  //Functions Outher
  const descriptionCar = () => {
    const car = cars.filter(car => car.ID === selectDelivery.ID_CAR)
    return car[0].DESCRIPTION
  }
  const descriptionDriver = () => {
    const driver = drivers.filter(driver => driver.ID === selectDelivery.ID_DRIVER)
    return driver[0].DESCRIPTION
  }
  const descriptionAssistants = () => {
    const assistant = assistants.filter(assistant => assistant.ID === selectDelivery.ID_ASSISTANT)
    return assistant[0].DESCRIPTION
  }
  const sendSalesProd = (e, product) => {
    if (e.target.checked){
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          if (produto.COD_ORIGINAL === product.COD_ORIGINAL){
            produto.STATUS = 'Enviado'
          }
        })
      })
    } else {
      selectDelivery.sales.forEach(sale =>{
        sale.products.forEach(produto => {
          if (produto.COD_ORIGINAL === product.COD_ORIGINAL){
            produto.STATUS = 'Entregando'
          }
        })
      })
    }
  }

  const finish = async () => {
    try {
      if(dateDelivery){
        const status = 'Finalizada'
    
        selectDelivery.STATUS = status
        selectDelivery['dateDelivery'] = dateDelivery
  
        selectDelivery.sales.forEach(sale =>{
          sale.products.forEach(produto => {
            if (produto.STATUS === 'Entregando'){
              produto.STATUS = status
            }
          })
        })
  
        const { data } = await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)
  
        if(data.ID){
          const resp = await api.get('sales/false/false/Aberta')
          stateSales.setSales(resp.data)
        }
    
        setDelivery(delivery.map( item => item.ID === data.ID ? data : item))
        setCurrentDeliv(currentDeliv.filter( deliv => deliv.ID !== data.ID ))
        setOpen(false)
      } else {
        alert('Selecione a data de entrega')
      }
    } catch (error) {
      console.log(error)
      alert('Erro de conexão, entrar em contato com ADM')
    }
  }
  //Component
  return(
    <form>
      <button type="button" onClick={()=>console.log(selectDelivery.sales)}>Teste</button>
      <div className={classes.divHeader}>
        <h3>{selectDelivery.DESCRIPTION}</h3>
        <p><span style={{fontWeight: 700}}>Motorista: </span>{descriptionDriver()}</p>
        <p><span style={{fontWeight: 700}}>Auxiliar: </span> {descriptionAssistants()}</p>
        <p><span style={{fontWeight: 700}}>Veículo: </span> {descriptionCar()}</p>
      </div>
      <div className={classes.divDateDelivery}>
        <span style={{fontWeight: 700}}>Data da Entrega: </span>
        <input 
          type="date"
          required
          onChange={e => setDateDelivery(e.target.value)}
        />
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow className={classes.tableHead}>
              <TableCell className={classes.tableHeadCellStart}>Nº Venda</TableCell>
              <TableCell className={classes.tableHeadCellStart}>Nome do Cliente</TableCell>
              <TableCell className={classes.tableHeadCell}>Valor Total</TableCell>
              <TableCell className={classes.tableHeadCell}>Emissão</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {selectDelivery.sales.map(sale => (
              <Row  key={sale.ID_SALES} sale={sale} sendSalesProd={sendSalesProd} classes={classes}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <div className={classes.btnActions}>
        <ButtonSucess 
          children={"Finalizar"}
          className={classes.btnSucess}
          onClick={finish}
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