import React from 'react'
import {
  makeStyles,
  TableHead,
  TableRow,
  TableCell
 } from '@material-ui/core'

 const useStyles = makeStyles(theme => ({
  tableHeadCell: {
    textAlign: 'end',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
  },
  tableHeadCellStart:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  tableHeadCellNull: {
    padding: 0,
    margin: 0
  }
 }))

 const Cell = ({ children, align = 'left' }) => {
  const classes = useStyles()
  return (
    <TableCell className={classes.tableHeadCell} style={{ textAlign: align }}>
      {children}
    </TableCell>
  )
 }

const TableHeadSale = () => {
  return(
    <TableHead>
      <TableRow>
        <Cell>Nº Venda</Cell>
        <Cell>Nome do Cliente</Cell>
        <Cell align='right'>Fone</Cell>
        <Cell align='right'>Emissão</Cell>
        <Cell align='right'>Loja</Cell>
      </TableRow>
    </TableHead>
  )
}

export default TableHeadSale