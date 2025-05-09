import React, { useState } from 'react'
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableContainer,
} from '@material-ui/core'

import EnhancedTableHead from '../../../components/EnhancedTableHead'
import { getComparator, stableSort } from '../../../functions/orderTable'

import { useStyle } from '../style'
import MonetaryValue from '../../../components/MonetaryValue'

const headCells = [
  {id: 'DESCRIPTION', label: 'DESCRIÇÃO'},
  {id: 'QTD', label: 'QUANT.'},
  {id: 'VALOR', label: 'VALOR'},
  {id: 'CHAVE_PIX', label: 'CHAVE PIX'},
]

const TableEmployees = ({ employees, title }) => {
  const [ order, setOrder ] = useState('desc')
  const [ orderBy, setOrderBy ] = useState('total')

  const classe = useStyle()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const qtdTotal = employees.reduce((acc, item) => acc + item.QTD, 0)
  const valorTotal = employees.reduce((acc, item) => acc + item.VALOR, 0)

  return (
    <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography component='h2' align='center' style={{marginTop: 20}}>
        {title}
      </Typography>
      <TableContainer
        style={{
          boxShadow: '0px 0px 4px #000',
          padding: 10,
          width: '50%',
        }}
      >
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
            classe={classe}
          />

          <TableBody>
            {stableSort(employees, getComparator(order, orderBy)).map((item, i) => (
              <TableRow key={i} className={classe.rowBody}>
                <TableCell>{item.DESCRIPTION}</TableCell>
                <TableCell>{item.QTD}</TableCell>
                <TableCell>
                  <MonetaryValue>
                    {item.VALOR}
                  </MonetaryValue>
                </TableCell>
                <TableCell>{item.CHAVE_PIX}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className={classe.rowBody}>
              <TableCell>TOTAIS</TableCell>
              <TableCell>{qtdTotal}</TableCell>
              <TableCell colSpan={2}>
                <MonetaryValue>
                  {valorTotal}
                </MonetaryValue>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TableEmployees