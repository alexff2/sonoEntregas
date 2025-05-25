import React, { useEffect, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Collapse,
  Paper,
  Checkbox
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp, Cancel } from '@material-ui/icons'

import useStyles from './style'

//Context
import { useAddress } from '../../context/addressContext'

//Components
import EnhancedTableHead from '../EnhancedTableHead'

//Functions
import { getDateBr } from '../../functions/getDates'
import { getComparator, stableSort } from '../../functions/orderTable'

const CheckProd = ({ product, classes, availableStocks, ID_MAINTENANCE }) => {
  const [ qtdDelivery, setQtdDelivery ] = useState(product.openQuantity)
  const [ inputNumber, setInputNumber ] = useState(false)

  const handleCheck = e => {
    product['qtdDelivery'] = qtdDelivery
    product['check'] = e.target.checked
    setInputNumber(!inputNumber)
    if (e.target.checked) {
      availableStocks.forEach(availableStock => {
        if (availableStock.COD_ORIGINAL === product.COD_ORIGINAL) {
          availableStock.availableStock -= qtdDelivery
        }
      })
    } else {
      availableStocks.forEach(availableStock => {
        if (availableStock.COD_ORIGINAL === product.COD_ORIGINAL) {
          availableStock.availableStock += qtdDelivery
        }
      })
    }
  }

  var availableStockQtd

  availableStocks.forEach(availableStock => {
    if (availableStock.COD_ORIGINAL === product.COD_ORIGINAL) {
      availableStockQtd = availableStock.availableStock
    }
  })

  if ( product.STATUS !== 'Enviado' ) {
    return (
      <>
        <TableCell>{product.STATUS}</TableCell>
        <TableCell></TableCell>
      </>
    )
  } else if(product.availableStock <= 0){
    return <TableCell colSpan={2}>{availableStockQtd}</TableCell>
  } else{
    return (
      <>
        <TableCell
          style={availableStockQtd < 0 ? {background: 'red', color: 'white'}: {}}
        >{availableStockQtd}</TableCell>

        <TableCell>
          <input 
            type="number" 
            style={{width: 40}}
            defaultValue={product.openQuantity}
            max={ product.openQuantity }
            min={ID_MAINTENANCE ? product.openQuantity : 1}
            onChange={e => setQtdDelivery(parseInt(e.target.value))}
            disabled={inputNumber}
          />
        </TableCell>

        <TableCell align="right" className={classes.tdCheckBox}>
          <Checkbox
            onChange={handleCheck}
          />
        </TableCell>
      </>
    )
  }
}

function Row({ sale, type, setSales, availableStocks }) {
  const [ open, setOpen ] = useState(false)
  const classes = useStyles()
  const { setAddress } = useAddress()

  const styleDateDelivery = () => {
    // VERIFICAR
    var dateDelivery, dateNow, dateAlert
    dateDelivery = new Date(sale.D_ENTREGA1)
    dateDelivery.setHours(0,0,0,0)

    dateNow = new Date().setHours(0,0,0,0)

    dateAlert = new Date()
    dateAlert.setDate(dateAlert.getDate()+2)
    dateAlert.setHours(0,0,0,0)

    if (sale.D_ENTREGA1 === null) {
      return { color: 'blue' }
    } else if (dateDelivery < dateNow) {
      return { color: 'red' }
    } else if (dateDelivery >= dateNow && dateDelivery <= dateAlert){
      return { color: 'yellow' }
    } else {
      return { color: 'black' }
    }
  }

  const setInformation = () => {
    setAddress({
      OBS2: sale.OBS2,
      ENDERECO: sale.ENDERECO,
      PONTOREF: sale.PONTOREF,
      OBS: sale.OBS,
      SCHEDULED: sale.SCHEDULED,
      OBS_SCHEDULED: sale.OBS_SCHEDULED
    })
  }

  return(
    <React.Fragment>
      <TableRow className={ type === 'home' ? classes.row : classes.row1 }>
        <TableCell onClick={setInformation}>
          {type === 'home' && <IconButton aria-label="expand row" style={{padding: 0}} onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>}
        </TableCell>
        <TableCell onClick={setInformation}>{sale.ID_SALES}</TableCell>
        <TableCell onClick={setInformation}>{sale.NOMECLI}</TableCell>
        <TableCell onClick={setInformation}>{getDateBr(sale.EMISSAO)}</TableCell>
        <TableCell
          onClick={setInformation}
          style={styleDateDelivery()}
        >
          {sale.D_ENTREGA1 !== null
            ? getDateBr(sale.D_ENTREGA1)
            : 'Sem Agendamento'}
        </TableCell>
        <TableCell onClick={setInformation}>{sale.SHOP}</TableCell>
        { (type === 'delivery' || type === 'forecast') && 
          <TableCell
            style={{ cursor: 'pointer' }} 
            onClick={() => {
              setSales(sales => sales.filter( saleCurrent => saleCurrent.ID !== sale.ID))
            }}
          >
            <Cancel color='secondary'/>
          </TableCell>
        }
      </TableRow>

      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={ type !== 'home' ? true : open} timeout="auto" unmountOnExit>
            <Box margin={0}>
              <Typography variant="h6" gutterBottom component="div" style={{padding: '0 10px', margin: 0}}>
                Produtos 
                {sale.ID_MAINTENANCE && (
                  <Box style={{background: 'orange', color: '#FFF', fontSize: 14, padding: 4}}>Assistência: {sale.ID_MAINTENANCE}</Box>
                )}
                {sale.isMaintenance && (
                  <Box style={{background: 'orange', color: '#FFF', fontSize: 14, padding: 4}}>Assistência: {sale.products.map(product => product.ID_MAINTENANCE)}</Box>
                )}
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow className={classes.tableProductsCells}>
                    <TableCell>Código</TableCell>
                    <TableCell>Descrição</TableCell>
                    {type !== 'delivery' && (
                      <>
                        <TableCell>Qtd. Tot.</TableCell>
                        <TableCell>Qtd. Proc.</TableCell>
                      </>
                    )}
                    {type === 'forecast' &&
                      <>
                        <TableCell>Qtd Disp</TableCell>
                        <TableCell>Qtd</TableCell>
                        <TableCell></TableCell>
                      </>
                    }
                    {type === 'delivery' &&
                      <>
                        <TableCell>Qtd</TableCell>
                      </>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.products.map((product) => (
                    <TableRow key={product.CODPRODUTO} className={classes.tableProductsCells}>
                      <TableCell>
                        {product.COD_ORIGINAL}
                      </TableCell>
                      <TableCell>{product.NOME}</TableCell>
                      {type !== 'delivery' && 
                        <>
                          <TableCell>{product.QUANTIDADE}</TableCell>
                          <TableCell>{product.QTD_MOUNTING}</TableCell>
                        </>
                      }

                      {type === 'forecast' && 
                        <CheckProd 
                          product={product}
                          classes={classes}
                          availableStocks={availableStocks}
                          ID_MAINTENANCE={sale.ID_MAINTENANCE}
                        />
                      }
                      {type === 'delivery' &&
                        <>
                          <TableCell>{product.quantityForecast}</TableCell>
                        </>
                      }
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

export default function TableSales({ 
  sales,
  setSales,
  type,
  availableStocks
}){
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('ID_SALES')
  const classes = useStyles()
  const { setAddress } = useAddress()

  useEffect(() => {
    if (sales.length === 0 || type === 'home') return

    setAddress({
      OBS2: sales[0].OBS2,
      ENDERECO: sales[0].ENDERECO,
      PONTOREF: sales[0].PONTOREF,
      OBS: sales[0].OBS,
      SCHEDULED: sales[0].SCHEDULED,
      OBS_SCHEDULED: sales[0].OBS_SCHEDULED
    })
  }, [setAddress, sales, type])

  //Functions

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const headCell = [
    { id: '', label: '' },
    { id: 'ID_SALES', label: 'DAV' },
    { id: 'NOMECLI', label: 'Cliente' },
    { id: 'EMISSAO', label: 'Emissão' },
    { id: 'D_ENTREGA1', label: 'Entrega' },
    { id: 'CODLOJA', label: 'Loja' },
    { id: '', label: '' },
  ]

  return(
    <TableContainer
      component={Paper}
      className={classes.tabContainer}
      style={type === 'home' ? { height: 'calc(100vh - 280px)' } : { height: 'auto' }}
    >
      <Table>

        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headCells={headCell}
          classe={classes}
        />

        <TableBody>
          {stableSort(sales, getComparator(order, orderBy))
            .map( (sale, i) => (
              <Row  
                key={i}
                sale={sale}
                setSales={setSales}
                classes={classes}
                type={type}
                availableStocks={availableStocks}
              />
          ))}
        </TableBody>
      
      </Table>
    </TableContainer>
  )
}