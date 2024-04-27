import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  header: {
    padding: 16
  }
})

export default function ModalEntryProductsNotes({ 
  setOpen,
  note,
  type
}) {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <h3>Fornecedor: {note.supplier}</h3>
        <p>Valor: {note.valueTotal}</p>
        <p>Valor: {note.value}</p>
      </div>

      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Qtd Bipou</TableCell>
              <TableCell>R$ Unitário</TableCell>
              <TableCell>R$ Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {note.products.map((produto, i) => (
              <TableRow hover key={i}>
                <TableCell>{produto.code}</TableCell>
                <TableCell>{produto.name}</TableCell>
                <TableCell>{produto.quantity}</TableCell>
                <TableCell>{produto.quantityBeeped}</TableCell>
                <TableCell>{produto.unitValue}</TableCell>
                <TableCell>{produto.valueTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
