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
  Typography,
  Paper,
  Checkbox
} from '@material-ui/core'

//Context
import { useSale } from '../../context/saleContext';

//Components
import EnhancedTableHead from '../../components/EnhancedTableHead'

//Functions
import getDate from '../../functions/getDates'
import { getComparator, stableSort } from '../../functions/orderTable'

const useStyles = makeStyles( theme =>({
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
  },
  tableBody: {
    overflow: 'scroll'
  },
  numberImput: {
    width: 40
  }
}))

const CheckProd = ({ sendSalesProd, selectSales, produto, classes }) => {
  const [ qtdDeliv, setQtdDeliv ] = useState(0)

  if (selectSales) {
    return null
  } else if (produto.STATUS !== 'Enviado') {
    return <div>{produto.STATUS}</div>
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
          />
        </TableCell>
        <TableCell align="right">
          <Checkbox
            onChange={(e) => sendSalesProd(e, produto, qtdDeliv)}
          />
        </TableCell>
      </>
    )
  }
}

function Row({sendSalesProd, classes, sale, selectSales}){
  return(
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          {sale.ID_SALES}
        </TableCell>
        <TableCell>{sale.NOMECLI}</TableCell>
        <TableCell>{sale.BAIRRO}
        </TableCell>
        <TableCell align="right">{getDate(sale.D_ENTREGA1)}</TableCell>
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
                  <TableCell>Qtd. Tot.</TableCell>
                  <TableCell>Qtd. Entregue</TableCell>
                  {selectSales ? null : <TableCell align="right">Qtd</TableCell>}
                  
                  <TableCell></TableCell>
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
                      selectSales={selectSales}
                      produto={produto}
                      classes={classes}
                    />
                    
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

export default function TableSales({ 
  selectSales,
  salesProd,
  setSalesProd
}){
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('idSales')
  const [currentSales, setCurrentSales] = useState([])
  const classes = useStyles()
  const { sales: salesFull } = useSale()

  //Start Component
  useEffect(()=>{
    if (selectSales) {
      setCurrentSales(selectSales)
    } else {
      setCurrentSales(salesFull)
    }
  },[selectSales, salesFull])

  //Functions
  const sendSalesProd = (e, saleProd, qtdDeliv) => {

    if (e.target.checked){
      saleProd['qtdDeliv'] = qtdDeliv
      setSalesProd([...salesProd, saleProd])
    } else {
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

  const headCell = [
    { id: 'ID_SALES', numeric: false, disablePadding: false, label: 'Nº Venda', class: classes.tableHeadCellStart },
    { id: 'NOMECLI', numeric: false, disablePadding: false, label: 'Nome do Cliente', class: classes.tableHeadCellStart },
    { id: 'BAIRRO', numeric: false, disablePadding: false, label: 'Bairro', class: classes.tableHeadCellStart },
    { id: 'D_ENTREGA1', numeric: true, disablePadding: false, label: 'Data Entrega', class: classes.tableHeadCell },
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
              <Row  key={sale.ID_SALES} sendSalesProd={sendSalesProd} classes={classes} sale={sale} selectSales={selectSales}/>
            ))}
          </TableBody>
        
        </Table>
      </TableContainer>
  )
}