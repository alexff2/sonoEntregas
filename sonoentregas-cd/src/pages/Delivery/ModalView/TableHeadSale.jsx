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
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  tableHeadCellStart:{
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  tableHead: {
    background: theme.palette.primary.main
  }
 }))

const TableHeadSale = () => {
  const classes = useStyles()
  return(
    <TableHead>
      <TableRow className={classes.tableHead}>
        <TableCell className={classes.tableHeadCellStart}>Nº Venda</TableCell>
        <TableCell className={classes.tableHeadCellStart}>Nome do Cliente</TableCell>
        <TableCell className={classes.tableHeadCell}>Valor Total</TableCell>
        <TableCell className={classes.tableHeadCell}>Emissão</TableCell>
      </TableRow>
    </TableHead>
  )
}

export default TableHeadSale