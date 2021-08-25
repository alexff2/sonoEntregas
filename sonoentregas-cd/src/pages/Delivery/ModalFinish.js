import React, { useState } from "react"
import {
  makeStyles,
  Box,
  Collapse,
  IconButton,
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
import { KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons'

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
    '&:hover': {
      background: theme.palette.primary.light
    }
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

const Row = ({ sale,sendSales, classes }) => {
  const [ openCell, setOpenCell ] = useState()
  return(
    <React.Fragment key={sale.ID_SALES}>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpenCell(!openCell)}>
            {openCell ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
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
        <TableCell align="right">
          <Checkbox onChange={e => sendSales(e, sale)}/>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openCell} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Produtos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Quantidade</TableCell>
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
                      <TableCell>{produto.QUANTIDADE}</TableCell>
                      <TableCell align="right">{
                        Intl
                          .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
                          .format(produto.NVTOTAL)
                      }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function ModalFinish({ setOpen, selectDelivery, currentDeliv, setCurrentDeliv}){
  //States
  const [ dateDelivery, setDateDelivery ] = useState(false)
  const [ sales, setSales ] = useState([{ID_SALES: 0}])

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
  const sendSales = (e, sale) => {
    if (e.target.checked){
      setSales([...sales, {ID_SALES: sale.ID_SALES}])
    } else {
      setSales(sales.filter( item => item.ID_SALES !== sale.ID_SALES ))
    }
  }

  const finish = async () => {
    if(dateDelivery){
      const status = 'Finalizada'
  
      selectDelivery.STATUS = status
      selectDelivery['dateDelivery'] = dateDelivery
  
      for( let j = 0; j < sales.length; j++){
        for( let i = 0; i < selectDelivery.sales.length; i++){
          if (sales[j].ID_SALES !== selectDelivery.sales[i].ID_SALES && selectDelivery.sales[i].STATUS !== 'Enviado') {
            selectDelivery.sales[i].STATUS = status
          } else {
            selectDelivery.sales[i].STATUS = 'Enviado'
          }
        }
      }
      
      const { data } = await api.put(`deliverys/status/${selectDelivery.ID}`, selectDelivery)

      if(data.ID){
        const resp = await api.get('sales/false/false/Enviado')
        stateSales.setSales(resp.data)
      }
  
      setDelivery(delivery.map( item => item.ID === data.ID ? data : item))
      setCurrentDeliv(currentDeliv.filter( deliv => deliv.ID !== data.ID ))
      setOpen(false)
    } else {
      alert('Selecione a data de entrega')
    }
  }
  //Component
  return(
    <form>
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
              <TableCell />
              <TableCell className={classes.tableHeadCellStart}>Nº Venda</TableCell>
              <TableCell className={classes.tableHeadCellStart}>Nome do Cliente</TableCell>
              <TableCell className={classes.tableHeadCell}>Valor Total</TableCell>
              <TableCell className={classes.tableHeadCell}>Emissão</TableCell>
              <TableCell className={classes.tableHeadCell}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {selectDelivery.sales.map(sale => (
              <Row sale={sale} sendSales={sendSales} classes={classes}/>
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