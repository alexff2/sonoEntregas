import React, { useEffect, useState } from 'react'
import {
  Box,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@material-ui/core'

import useStyles from '../Product/style'
import { useAlertSnackbar } from '../../context/alertSnackbarContext'
import { ButtonSuccess } from '../../components/Buttons'
import api from '../../services/api'

export default function BarCode({ handleRenderBox }) {
  const [ productSelect, setProductSelect ] = useState('')
  const [ qtdBeep, setQtdBeep ] = useState('')
  const [ serialNumberSelect, setSerialNumberSelect ] = useState('')
  const [ serialsNumber, setSerialsNumber ] = useState([])
  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()

  useEffect(() => {
    document.getElementById('serialNumberId').focus()
  }, [])

  const handleCreateSerial = async () => {
    try {
      const beep = serialNumberSelect

      const [id, serieString] = beep.split(' ')

      if (serieString === '' || beep.split(' ').length === 1) {
        setAlertSnackbar('Número inválido!')

        return
      }
      
      const { data: product } = await api.get('/product/to-beep', {
        params: {
          originalId: id,
        }
      })

      setProductSelect(product.name)

      const { data } = await api.post('serial/first', {
        serialNumber: serieString,
        productId: product.code,
        module: 'single'
      })

      setQtdBeep(product.serialNumbers.length + 1)
      setSerialsNumber([...product.serialNumbers, data.serialNumberResponse])
      setSerialNumberSelect('')
    } catch (error) {
      console.log(error)

      if (error.response) {
        console.log(error.response.data)

        if (error.response.data === 'the serial number already exists and is not finalized!') {
          setAlertSnackbar('Número de série já foi dado entrada em outro produto!')
        }

        if (error.response.data.error === 'Product not found') {
          setAlertSnackbar('Produto não encontrado!')
        }
      }
    }
  }

  return (
    <Box>
      <Box className={classes.barHeader}>
        <p style={{color: '#FFF'}}>
          {productSelect}
          {(qtdBeep !== '') && (
            <p>Qtd: {qtdBeep}</p>
          )}
        </p>
      </Box>

      <Input
        id='serialNumberId'
        autoComplete='off'
        style={{ width: '85%', marginTop: 20}}
        placeholder='Leitura número de série'
        value={serialNumberSelect}
        onChange={e => setSerialNumberSelect(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleCreateSerial()}
      />

      <Box component={Paper} style={{ marginTop: 20}}>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {serialsNumber.map((serialNumber, i) => (
                <TableRow hover key={i}> 
                  <TableCell>{serialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ButtonSuccess onClick={handleRenderBox} className={classes.btnAdd}>Voltar</ButtonSuccess>
    </Box>
  )
}