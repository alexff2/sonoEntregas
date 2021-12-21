import React, { useEffect, useState } from 'react'
import {
  makeStyles,
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
import { KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons'

//Context
import { useShop } from '../context/shopContext';

//Components
import EnhancedTableHead from './EnhancedTableHead'

//Functions
import { getDateBr } from '../functions/getDates'
import { getComparator, stableSort } from '../functions/orderTable'

const useStyles = makeStyles( theme =>({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    '&:hover': {
      background: theme.palette.primary.light
    }
  },
  root1: {
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
  },
  tableBody: {
    overflow: 'scroll'
  },
  numberImput: {
    width: 40
  },
  dateDelivRed: {
    color: 'red'
  },
  dateDelivBlack: {
    color: 'black'
  },
  dateDelivYellow: {
    color: 'yellow'
  }
}))

const CheckProd = ({ sendSalesProd, type, produto, classes }) => {
  const [ qtdDeliv, setQtdDeliv ] = useState(0)
  const [ inputNumber, setInputNumber ] = useState(false)

  if (type === 'update' || type === 'home') {
    return null
  } else if (produto.STATUS !== 'Enviado') {
    return <TableCell>{produto.STATUS}</TableCell>
  } else {
    return (
      <>
        <TableCell>
          <input 
            type="number" 
            className={classes.numberImput}
            defaultValue={produto.QUANTIDADE - produto.QTD_DELIV}
            max={produto.QUANTIDADE - produto.QTD_DELIV}
            min={1}
            onChange={e => setQtdDeliv(e.target.value)}
            disabled={inputNumber}
          />
        </TableCell>
        <TableCell align="right">
          <Checkbox
            onChange={(e) => sendSalesProd(e, produto, qtdDeliv, setInputNumber)}
          />
        </TableCell>
      </>
    )
  }
}

function Row({sendSalesProd, sale, type}) {
  const [ open, setOpen ] = useState(false)
  const { shop } = useShop()
  const classes = useStyles()

  const setShops = codShop => {
    const shopCurrent = shop[codShop]
    return shopCurrent.database
  }

  const styleDateDeliv = () => {
    var dateDeliv, dateNow, dateAlert
    dateDeliv = new Date(sale.D_ENTREGA1)
    dateDeliv.setDate(dateDeliv.getDate()+1)
    dateDeliv.setHours(0,0,0,0)

    dateNow = new Date().setHours(0,0,0,0)

    dateAlert = new Date()
    dateAlert.setDate(dateAlert.getDate()+2)
    dateAlert.setHours(0,0,0,0)

    if (dateDeliv < dateNow) {
      return classes.dateDelivRed
    } else if (dateDeliv >= dateNow && dateDeliv <= dateAlert){
      return classes.dateDelivYellow
    } else {
      return classes.dateDelivBlack
    }
  }

  return(
    <React.Fragment>
      <TableRow className={ type === 'home' ? classes.root : classes.root1 }>
        {type === 'home' ? 
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell> : null
        }
        <TableCell component="th" scope="row">
          {sale.ID_SALES}
        </TableCell>
        <TableCell>{sale.NOMECLI}</TableCell>
        <TableCell>{sale.BAIRRO}
        </TableCell>
        <TableCell align="right" className={styleDateDeliv()}>{getDateBr(sale.D_ENTREGA1)}</TableCell>
        <TableCell align="right">{setShops(sale.CODLOJA)}</TableCell>
      </TableRow>
  
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={ type !== 'home' ? true : open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Produtos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Qtd. Tot.</TableCell>
                    <TableCell>Qtd. Entregue</TableCell>
                    {type === 'update' || type === 'home' ? null :
                      <>
                        <TableCell align="right">Qtd</TableCell>
                        <TableCell></TableCell>
                      </>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.products.map((produto) => (
                    <TableRow key={produto.CODPRODUTO}>
                      <TableCell component="th" scope="row">
                        {produto.COD_ORIGINAL}
                      </TableCell>
                      <TableCell>{produto.DESCRICAO}</TableCell>
                      <TableCell>{produto.QUANTIDADE}</TableCell>
                      <TableCell>{produto.QTD_DELIV}</TableCell>
                      
                      <CheckProd 
                        sendSalesProd={sendSalesProd} 
                        type={type}
                        produto={produto}
                        classes={classes}
                      />
                      
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
  selectSales,
  salesProd,
  setSalesProd,
  type
}){
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('idSales')
  const [currentSales, setCurrentSales] = useState([])
  const classes = useStyles()

  //Start Component
  useEffect(()=>{
    setCurrentSales(selectSales)
  },[selectSales])

  //Functions
  const sendSalesProd = (e, saleProd, qtdDeliv, setInputNumber) => {
    if (e.target.checked){
      setInputNumber(true)

      saleProd['qtdDeliv'] = qtdDeliv

      setSalesProd([...salesProd, saleProd])
    } else {
      setInputNumber(false)

      setSalesProd(salesProd.filter( item => {
        if (item.ID_SALES !== saleProd.ID_SALES) {
          return true
        } else if (item.COD_ORIGINAL !== saleProd.COD_ORIGINAL) {
          return true
        } else {
          return false
        }
      }))
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const headCell = type === 'home' ? [
    { id: '', numeric: false, disablePadding: false, label: '', class: classes.tableHeadCellStart },
    { id: 'ID_SALES', numeric: false, disablePadding: false, label: 'Nº Venda', class: classes.tableHeadCellStart },
    { id: 'NOMECLI', numeric: false, disablePadding: false, label: 'Nome do Cliente', class: classes.tableHeadCellStart },
    { id: 'BAIRRO', numeric: false, disablePadding: false, label: 'Bairro', class: classes.tableHeadCellStart },
    { id: 'D_ENTREGA1', numeric: true, disablePadding: false, label: 'Data Entrega', class: classes.tableHeadCell },
    { id: 'CODLOJA', numeric: true, disablePadding: false, label: 'Loja', class: classes.tableHeadCell }
  ] : [
    { id: 'ID_SALES', numeric: false, disablePadding: false, label: 'Nº Venda', class: classes.tableHeadCellStart },
    { id: 'NOMECLI', numeric: false, disablePadding: false, label: 'Nome do Cliente', class: classes.tableHeadCellStart },
    { id: 'BAIRRO', numeric: false, disablePadding: false, label: 'Bairro', class: classes.tableHeadCellStart },
    { id: 'D_ENTREGA1', numeric: true, disablePadding: false, label: 'Data Entrega', class: classes.tableHeadCell },
    { id: 'CODLOJA', numeric: true, disablePadding: false, label: 'Loja', class: classes.tableHeadCell }
  ]

  return(
    <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCell}
            classe={classes}
          />
          
          <TableBody className={classes.tableBody}>
            {stableSort(currentSales, getComparator(order, orderBy))
              .map( sale => (
              <Row  key={sale.ID_SALES} sendSalesProd={sendSalesProd} classes={classes} sale={sale} type={type}/>
            ))}
          </TableBody>
        
        </Table>
      </TableContainer>
  )
}