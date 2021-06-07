import React, { useEffect, useState } from 'react'
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
  Paper,
  Checkbox
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons'

//Context
import { useSale } from '../../context/saleContext';
import getDate from '../../functions/getDates'

const useStyles = makeStyles( theme =>({
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
  },
  tableBody: {
    overflow: 'scroll'
  }
}))

export default function TableSales({ 
  selectSales,
  sales,
  setSales
}){
  const [open, setOpen] = useState(false)
  const [currentSales, setCurrentSales] = useState([])
  const classes = useStyles()
  const { sales: salesFull } = useSale()

  //Start Component
  useEffect(()=>{
    //const availableSales = salesFull.filter( item => item.STATUS === 'Enviado')
    if (selectSales) {
      setCurrentSales(selectSales)
    } else {
      setCurrentSales(salesFull)
    }
  },[selectSales, salesFull])

  //Functions
  const sendSales = (e, sale) => {
    if (e.target.checked){
      setSales([...sales, sale])
    } else {
      setSales(sales.filter( item => item.codvenda !== sale.codvenda ))
    }
  }

  return(
    <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow className={classes.tableHead}>
              <TableCell />
              <TableCell className={classes.tableHeadCellStart}>Nº Venda</TableCell>
              <TableCell className={classes.tableHeadCellStart}>Nome do Cliente</TableCell>
              <TableCell className={classes.tableHeadCellStart}>Bairro</TableCell>
              <TableCell className={classes.tableHeadCell}>Data Entrega</TableCell>
              <TableCell className={classes.tableHeadCell}></TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody className={classes.tableBody}>
            {currentSales.map((sale) => (
              <React.Fragment key={sale.ID_SALES}>
                <TableRow className={classes.root}>
                  <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                      {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {sale.ID_SALES}
                  </TableCell>
                  <TableCell>{sale.NOMECLI}</TableCell>
                  <TableCell>{sale.BAIRRO}
                  </TableCell>
                  <TableCell align="right">{getDate(sale.D_ENTREGA1)}</TableCell>
                  <TableCell align="right">
                    {selectSales ? null : 
                    <Checkbox
                      onChange={(e) => sendSales(e, sale)}
                    />
                    }
                  </TableCell>
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
            ))}
          </TableBody>
        
        </Table>
      </TableContainer>
  )
}