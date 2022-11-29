import React, { useEffect, useState } from 'react'
import { 
  Box,
  TableRow,
  TableCell,
  Checkbox
 } from '@material-ui/core'

const RowProd = ({product, status, stateCheckedAllProd, type })=>{
  const [ checkProd, setCheckProd ] = useState(false)

  useEffect(()=>{
    setCheckProd(stateCheckedAllProd)
  },[stateCheckedAllProd])

  const checkedPro = e => {
    if (e.target.checked) {
      setCheckProd(true)
      product.STATUS = 'Finalizada'
      product.DELIVERED = false //false is zero
      product.REASON_RETURN = 'NULL'
    } else {
      setCheckProd(false)
      product.STATUS = 'Enviado'
      product.DELIVERED = true //false is zero
    }
  }

  return(
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {product.CODPRODUTO}
        </TableCell>
        <TableCell>{product.DESCRICAO}</TableCell>
        <TableCell>{product.QTD_DELIV}</TableCell>
        <TableCell align="right">{
          Intl
            .NumberFormat('pt-br',{style: 'currency', currency: 'BRL'})
            .format(product.NVTOTAL)
        }</TableCell>
        {type === 'open' &&
          <TableCell align="right">
            <Checkbox
              onChange={checkedPro}
              checked={checkProd}
            />
          </TableCell>
        }
        {status === 'Finalizada' &&
          <TableCell align="right">
            {product.DELIVERED ? 
              <span style={{
                fontSize: 12,
                backgroundColor: 'red',
                color: 'white',
                padding: 3
              }}>Retorno</span>  : 
              <span style={{
                fontSize: 12,
                backgroundColor: 'green',
                color: 'white',
                padding: 3
              }}>Entregue</span>}
          </TableCell>
        }
      </TableRow>
      {(!checkProd && type === 'open') &&
        <TableRow>
          <TableCell colSpan={5}>
            <Box>
              Motivo de retorno: 
              <input type="text" onChange={
                e => product.REASON_RETURN = e.target.value
              }/>
            </Box>
          </TableCell>
        </TableRow>
      }
      { (status === 'Finalizada' && product.REASON_RETURN !== null) &&
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
