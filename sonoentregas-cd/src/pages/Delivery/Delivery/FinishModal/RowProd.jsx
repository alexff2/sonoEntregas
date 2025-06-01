import React from 'react'
import { 
  Box,
  TableRow,
  TableCell,
  Chip,
 } from '@material-ui/core'
import api from '../../../../services/api'

const RowProd = ({product, loadingData})=>{
  const handleReasonReturn = async () => {
    const reason = prompt('Motivo do retorno:')
    if (reason === null) {
      return // User cancelled the prompt
    }

    if (!reason) {
      alert('Motivo não pode ser vazio.')
      return
    }

    if (reason.length > 100) {
      alert('Motivo muito longo, máximo de 100 caracteres.')
      return
    }

    try {
      await api.put(`delivery/${product.D_DELIV_MAIN || product.ID_DELIVERY}/returns`, {
        product: {
          ...product,
          REASON_RETURN: reason
        },
      })
  
      loadingData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleReturnsDelete = async () => {
    const result = window.confirm('Deseja reconfirmar entrega?')
    if (result) {
      try {
        await api.put(`delivery/${product.D_DELIV_MAIN || product.ID_DELIVERY}/returns-delete`, {product})
        loadingData()
      } catch (error) {
        console.log(error)
      }
    }
    return
  }

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
          {product.ID_MAINTENANCE &&(
            <Chip
              label={product.DONE ? 'Entregue' : 'Retorno'}
              color={product.DONE ? 'primary' : 'secondary'}
              size="small"
              onClick={product.DONE ? handleReasonReturn : handleReturnsDelete}
            />
          )}
          {!product.ID_MAINTENANCE &&(
            <Chip
              label={!product.DELIVERED ? 'Entregue' : 'Retorno'}
              color={!product.DELIVERED ? 'primary' : 'secondary'}
              size="small"
              onClick={!product.DELIVERED ? handleReasonReturn : handleReturnsDelete}
            />
          )}          
        </TableCell>
      </TableRow>
      {product.REASON_RETURN && (
        <TableRow>
          <TableCell colSpan={5}>
            <Box>
              <span style={{color: 'red', fontWeight: 'bold'}}>Motivo do retorno: </span>
              {product.REASON_RETURN}
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default RowProd
