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
  },
  tableHeadCellNull: {
    padding: 0,
    margin: 0
  }
 }))

const TableHeadSale = ({type}) => {
  const classes = useStyles()
  return(
    <TableHead>
      <TableRow className={classes.tableHead}>
        <TableCell className={classes.tableHeadCellStart}>Nº Venda</TableCell>
        <TableCell className={classes.tableHeadCellStart}>Nome do Cliente</TableCell>
        <TableCell className={classes.tableHeadCell}>Fone</TableCell>
        <TableCell className={classes.tableHeadCell}>Emissão</TableCell>
        <TableCell className={classes.tableHeadCell}>Loja</TableCell>
        <TableCell className={classes.tableHeadCell}></TableCell>
      </TableRow>
    </TableHead>
  )
}

export default TableHeadSale