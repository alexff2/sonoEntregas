import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import { useBackdrop } from '../../../context/backdropContext'
import api from '../../../services/api'

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

export default function ModalNotesProducts({ note }) {
  const [products, setProducts] = useState([])
  const {setAlertSnackbar} = useAlertSnackbar()
  const {setOpenBackDrop} = useBackdrop()
  const classes = useStyles()

  useEffect(() => {
    setOpenBackDrop(true)
    api.get(`purchase/note/${note.id}/products`)
      .then(({data}) => {
        setProducts(data.purchaseNoteProducts)
        setOpenBackDrop(false)
      })
      .catch(err => {
        console.log(err)
        setAlertSnackbar('Internal Error!')
        setOpenBackDrop(false)
      })
  }, [setOpenBackDrop, setAlertSnackbar, note])

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <h3>Fornecedor: Maranhão Colhões</h3>
        <p>Emissão: {note.issue}</p>
        <p>Valor: {note.value}</p>
      </div>

      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align='right'>Quantidade</TableCell>
              <TableCell align='right'>R$ Unitário</TableCell>
              <TableCell align='right'>R$ Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((produto, i) => (
              <TableRow hover key={i}>
                <TableCell>{produto.item}</TableCell>
                <TableCell>{produto.originalCode}</TableCell>
                <TableCell>{produto.name}</TableCell>
                <TableCell align='right'>{produto.quantity}</TableCell>
                <TableCell align='right'>{produto.unitaryValue}</TableCell>
                <TableCell align='right'>{produto.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
