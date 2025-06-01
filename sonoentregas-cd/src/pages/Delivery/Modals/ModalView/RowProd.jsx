import React from 'react'
import { 
  Box,
  TableRow,
  TableCell,
 } from '@material-ui/core'

 const StatusProduct = ({color='red', label}) => {
  return (
    <span
      style={{
        fontSize: 12,
        backgroundColor: color,
        color: 'white',
        padding: 3
      }}
    >{label}</span>
  )
}

const RowProd = ({product, type, status})=>{
  return(
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {product.COD_ORIGINAL}
        </TableCell>
        <TableCell>{product.NOME}</TableCell>
        <TableCell>{product.quantityForecast ? product.quantityForecast : product.QTD_DELIV}</TableCell>
        <TableCell align="right">{
          Intl
            .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
            .format(product.NVTOTAL)
        }</TableCell>
        <TableCell align="right">
          {(type !== 'forecastView' && status === 'Finalizada') && <>
            {product.REASON_RETURN
              ? <StatusProduct color="red" label="Retorno" />
              : <StatusProduct color="green" label="Entregue" />
            }
          </>
          }
        </TableCell>
      </TableRow>
      {product.REASON_RETURN &&
        <TableRow>
          <TableCell colSpan={5}>
            <Box>
              Motivo de retorno: {product.REASON_RETURN}
            </Box>
          </TableCell>
        </TableRow>
      }
    </>
  )
}

export default RowProd
