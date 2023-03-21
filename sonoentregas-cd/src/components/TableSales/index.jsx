import React, { useState } from 'react'
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

const CheckProd = ({ product, classes }) => {
  const [ qtdDelivery, setQtdDelivery ] = useState(product.openQuantity)
  const [ inputNumber, setInputNumber ] = useState(false)

  if ( product.STATUS !== 'Enviado' ) {
    return (
      <>
        <TableCell>{product.STATUS}</TableCell>
        <TableCell></TableCell>
      </>
    )
  } else {
    return (
      <>
        <TableCell>
          <input 
            type="number" 
            style={{width: 40}}
            defaultValue={product.openQuantity}
            max={ product.openQuantity }
            min={1}
            onChange={e => setQtdDelivery(parseInt(e.target.value))}
            disabled={inputNumber}
          />
        </TableCell>

        <TableCell align="right" className={classes.tdCheckBox}>
          <Checkbox
            onChange={ e => {
              product['qtdDelivery'] = qtdDelivery
              product['check'] = e.target.checked
              setInputNumber(!inputNumber)
            }}
          />
        </TableCell>
      </>
    )
  }
}

function Row({ sale, type, setSales}) {
  const [ open, setOpen ] = useState(false)
  const classes = useStyles()
  const { setAddress } = useAddress()

  const styleDateDelivery = () => {
    // VERIFICAR
    var dateDelivery, dateNow, dateAlert
    dateDelivery = new Date(sale.D_ENTREGA1)
    dateDelivery.setDate(dateDelivery.getDate()+1)
    dateDelivery.setHours(0,0,0,0)

    dateNow = new Date().setHours(0,0,0,0)

    dateAlert = new Date()
    dateAlert.setDate(dateAlert.getDate()+2)
    dateAlert.setHours(0,0,0,0)

    if (dateDelivery < dateNow) {
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
        <TableCell>
          {type === 'home' && <IconButton aria-label="expand row" style={{padding: 0}} onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>}
        </TableCell>
        <TableCell onClick={setInformation}>{sale.ID_SALES}</TableCell>
        <TableCell onClick={setInformation}>{sale.NOMECLI}</TableCell>
        <TableCell onClick={setInformation}>{sale.BAIRRO}</TableCell>
        <TableCell onClick={setInformation} style={styleDateDelivery()}>{getDateBr(sale.D_ENTREGA1)}</TableCell>
        <TableCell onClick={setInformation}>{sale.SHOP}</TableCell>
        { type === 'delivery' && 
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
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow className={classes.tableProductsCells}>
                    <TableCell>Código</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Qtd. Tot.</TableCell>
                    <TableCell>Qtd. Proc.</TableCell>
                    {type === 'forecast' &&
                      <>
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
                      <TableCell>{product.QUANTIDADE}</TableCell>
                      <TableCell>{product.QTD_MOUNTING}</TableCell>

                      {type === 'forecast' && 
                        <CheckProd 
                          product={product}
                          classes={classes}
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
  type
}){
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('idSales')
  const classes = useStyles()

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
    { id: 'BAIRRO', label: 'Bairro' },
    { id: 'D_ENTREGA1', label: 'Entrega' },
    { id: 'CODLOJA', label: 'Loja' },
    { id: '', label: '' }
  ]

  return(
    <TableContainer
      component={Paper}
      className={classes.tabContainer}
      style={type === 'home' ? { maxHeight: '600px' } : { height: 'calc(100vh - 490px)' }}
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
              />
          ))}
        </TableBody>
      
      </Table>
    </TableContainer>
  )
}