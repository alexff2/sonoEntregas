import React, { useState } from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'

import { CellStatus } from './index'
import Modal from '../../../components/Modal'

export default function ShowProductsTransfer({ products }) {
  const [ openModalSerialNumber, setOpenModalSerialNumber] = useState(false)
  const [ serialNumbers, setSerialNumbers] = useState([])

  const handleOpenModalSerialNumber = serialNumbers => {
    setSerialNumbers(serialNumbers)
    setOpenModalSerialNumber(true)
  }

  return (
    <TableContainer style={{ width: '100%' }}>
      <Table size='small' stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Quantidade</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, i) => (
            <TableRow
              style={{ cursor: 'pointer' }}
              hover
              key={i}
              onClick={() => handleOpenModalSerialNumber(product.serialNumbers)}
            >
              <TableCell>{product.item}</TableCell>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <CellStatus>{product.status}</CellStatus>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        title='Números de série bipados'
        open={openModalSerialNumber}
        setOpen={setOpenModalSerialNumber}
      >
        { serialNumbers.length > 0
          ? serialNumbers.map(serialNumber => (
            <Box key={serialNumber}>{serialNumber}</Box>
          ))
          : <Box>Nenhum número de serie bipado para este produto!</Box>
        }
      </Modal>
    </TableContainer>
  )
}
