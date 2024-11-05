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

const headCells = [
  {id: 'DESCRIPTION', label: 'DESCRIÇÃO'},
  {id: 'qtd_realized', label: 'CONCRETIZADO'},
  {id: 'qtd_return', label: 'RETORNO'},
  {id: 'total', label: 'TOTAL'},
]

const TableDeliveries = ({ deliveries, title }) => {
  const [ order, setOrder ] = useState('desc')
  const [ orderBy, setOrderBy ] = useState('total')

  const classe = useStyle()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

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
            {stableSort(deliveries, getComparator(order, orderBy)).map((item, i) => (
              <TableRow key={i} className={classe.rowBody}>
                <TableCell>{item.DESCRIPTION}</TableCell>
                <TableCell>{item.qtd_realized}</TableCell>
                <TableCell>{item.qtd_return}</TableCell>
                <TableCell>{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className={classe.rowBody}>
              <TableCell>TOTAIS</TableCell>
              <TableCell>{deliveries.reduce((acc, item) => acc + item.qtd_realized, 0)}</TableCell>
              <TableCell>{deliveries.reduce((acc, item) => acc + item.qtd_return, 0)}</TableCell>
              <TableCell>{deliveries.reduce((acc, item) => acc + item.total, 0)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TableDeliveries