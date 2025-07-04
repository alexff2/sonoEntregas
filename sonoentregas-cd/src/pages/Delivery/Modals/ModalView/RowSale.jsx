import React from 'react'
import { 
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  makeStyles,
  Tooltip,
  IconButton
 } from '@material-ui/core'
import { RemoveShoppingCart } from "@material-ui/icons"

import RowProd from './RowProd'

import { getDateBr } from '../../../../functions/getDates'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      borderBottom: 'unset'
    },
    background: theme.palette.primary.light,
    '& > td': {
      color: '#FFF'
    }
  }
}))

const RowSale = ({ sale, type, status, handleInvalidationSale }) => {
  const classes = useStyles()
  return(
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell scope="row">
          {sale.ID_SALES}
        </TableCell>
        <TableCell>{sale.NOMECLI}</TableCell>
        <TableCell align="right">{sale.FONE}</TableCell>
        <TableCell align="right">{getDateBr(sale.EMISSAO)}</TableCell>
        <TableCell align="right">{sale.SHOP}</TableCell>
        {(type === 'forecastView' && sale.requestInvalidate)
          ? <TableCell align='right' style={{padding: 0}}>
            <Tooltip title='Negar venda!'>
              <IconButton onClick={() => handleInvalidationSale(sale.id)}>
                <RemoveShoppingCart style={{color: '#FFF'}}/>
              </IconButton>
            </Tooltip>
          </TableCell>
          : <TableCell></TableCell>
        }
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Produtos 
              <span style={{fontSize: 12, color: '#FF4070'}}>
                {sale.OBS && ` - OBS: ${sale.OBS}`}
                {sale.obs && ` - Validado em: ${sale.dateValidationFormat} | Obs: ${sale.obs}`}
              </span>
              {sale.isMaintenance && (
                <Box style={{background: 'orange', color: '#FFF', fontSize: 14, padding: 4}}>
                  Assistência: {sale.products.map(product => product.ID_MAINTENANCE).join(', ')}
                </Box>
              )}
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Qtd. Entrega</TableCell>
                  <TableCell align="right">Valor (R$)</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.products.map((product) => (
                  <RowProd
                    key={product.COD_ORIGINAL}
                    status={status}
                    type={type}
                    product={product}
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
