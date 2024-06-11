import React, { useState } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { ButtonSuccess } from '../../../../components/Buttons'

import api from '../../../../services/api'
import { useAlertSnackbar } from '../../../../context/alertSnackbarContext'

export default function SearchPurchaseOrder({
  openDialogSearch,
  setOpenDialogSearch,
  handleImportPurchaseOrder
}) {
  const [loading, setLoading] = useState(false)
  const [typeSearchOrder, setTypeSearchOrder] = useState('code')
  const [searchOrder, setSearchOrder] = useState('')
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const { setAlertSnackbar } = useAlertSnackbar()

  const handleSearch = async () => {
    if (searchOrder === '') {
      setAlertSnackbar('Pesquisa vazia')

      return
    }

    try {
      setLoading(true)
 
      const { data } = await api.get('purchase/order', {
        params: {
          type: typeSearchOrder,
          search: searchOrder
        }
      })

      if (data.purchaseOrder.length === 0) {
        setAlertSnackbar(
          typeSearchOrder === 'code'
            ? 'Pedido não encontrado!'
            : 'Não existe pedido nessa data selecionada!'
        )

        setLoading(false)

        return
      }

      setPurchaseOrders(data.purchaseOrder)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <Dialog
      open={openDialogSearch}
      onClose={() => setOpenDialogSearch(false)}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>Pesquisa de pedidos de compra</DialogTitle>
      <DialogContent>
        <Box
          borderRadius={1}
          display={'flex'}
          alignItems={'center'}
          padding={'8px'}
          bgcolor={'#CCC'}
        >
          <select
            style={{
              width: 88,
              height: '36.6px',
              padding: 4,
              marginRight: 8,
              border: 'none',
              borderRadius: 4,
              outline: 'none'
            }}
            value={typeSearchOrder}
            onChange={e => {
              setSearchOrder('')
              setTypeSearchOrder(e.target.value)
            }}
          >
            <option value={'code'}>Código</option>
            <option value={'issue'}>Emissão</option>
          </select>
          <InputBase
            type={typeSearchOrder === 'code' ? 'number' : 'date'}
            style={{
              background: '#fff',
              padding: '1.6px 8px',
              width: 250,
              marginRight: 8,
              borderRadius: 4
            }}
            placeholder='Digite o número do pedido'
            value={searchOrder}
            onChange={e => setSearchOrder(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <ButtonSuccess
            loading={loading}
            onClick={handleSearch}
          >Pesquisar</ButtonSuccess>
        </Box>
        <TableContainer component={Paper} style={{height: 500}}>
          <Table size='small' stickyHeader >
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Emissão</TableCell>
                <TableCell>Obs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                purchaseOrders.map(item => (
                  <TableRow
                    hover
                    key={item.code}
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setOpenDialogSearch(false)
                      handleImportPurchaseOrder(item.code)
                    }}
                  >
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>{item.issue}</TableCell>
                    <TableCell>{item.obs}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}