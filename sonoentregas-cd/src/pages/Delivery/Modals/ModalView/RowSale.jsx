import React from 'react'
import { 
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  makeStyles
 } from '@material-ui/core'

import RowProd from './RowProd'

import { getDateBr } from '../../../../functions/getDates'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light
  }
}))

const RowSale = ({ sale, type, status }) => {
  const classes = useStyles()
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
        <TableCell align="right">{getDateBr(sale.EMISSAO)}</TableCell>
        <TableCell align="right">{sale.SHOP}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Produtos 
              <span style={{fontSize: 12, color: '#FF4070'}}>{
                sale.OBS && ` - OBS: ${sale.OBS}`
              }</span>
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Qtd. Entrega</TableCell>
                  <TableCell align="right">Valor (R$)</TableCell>
                  {type === 'open' && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.products.map((product) => (
                  <RowProd key={product.CODPRODUTO}
                    product={product}
                    status={status}
                    type={type}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default RowSale
