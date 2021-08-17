import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
  Paper
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons'

import { useSale } from '../../context/saleContext'
import { useShop } from '../../context/shopContext'

import EnhancedTableHead from '../../components/EnhancedTableHead'

import getDate from '../../functions/getDates'
import { getComparator, stableSort } from '../../functions/orderTable'
import api from '../../services/api'

const useStyles = makeStyles(theme =>({
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

function Row({ row, shop, classes }) {
  const [open, setOpen] = React.useState(false)

  const setShops = codShop => {
    const shopCurrent = shop[codShop]
    return shopCurrent.database
  }
  
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.ID_SALES}</TableCell>
        <TableCell>{row.NOMECLI}</TableCell>
        <TableCell align="right">{row.BAIRRO}</TableCell>
        <TableCell align="right">{getDate(row.D_ENTREGA1)}</TableCell>
        <TableCell align="right">{setShops(row.CODLOJA)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
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
                  {row.products.map((produto) => (
                    <TableRow key={produto.CODPRODUTO}>
                      <TableCell component="th" scope="row">
                        {produto.COD_ORIGINAL}
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
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    ID_SALES: PropTypes.number.isRequired,
    NOMECLI: PropTypes.string.isRequired,
    BAIRRO: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        CODPRODUTO: PropTypes.number.isRequired,
        DESCRICAO: PropTypes.string.isRequired,
        NVTOTAL: PropTypes.number.isRequired,
      }),
    ).isRequired,
    EMISSAO: PropTypes.string.isRequired,
    STATUS: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired
}

export default function Sales() {
  const [ order, setOrder ] = useState('asc')
  const [ orderBy, setOrderBy ] = useState('idSales')

  const classes = useStyles()
  const { sales, setSales } = useSale()
  const { shop } = useShop()

  useEffect(()=>{
    api.get('sales').then( res => setSales(res.data))
  },[setSales])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const headCell = [
    { id: '', numeric: false, disablePadding: false, label: '', class: {} },
    { id: 'ID_SALES', numeric: false, disablePadding: false, label: 'Nº Venda', class: classes.tableHeadCellStart },
    { id: 'NOMECLI', numeric: false, disablePadding: false, label: 'Nome do Cliente', class: classes.tableHeadCellStart },
    { id: 'BAIRRO', numeric: true, disablePadding: false, label: 'Bairro', class: classes.tableHeadCell },
    { id: 'D_ENTREGA1', numeric: true, disablePadding: false, label: 'Data Entrega', class: classes.tableHeadCell },
    { id: 'CODLOJA', numeric: true, disablePadding: false, label: 'Loja', class: classes.tableHeadCell },
  ]

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headCells={headCell}
          classe={classes}
        />
        <TableBody>
          {stableSort(sales, getComparator(order, orderBy))
            .map( row => (
            <Row key={row.ID} row={row} shop={shop} classes={classes}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
