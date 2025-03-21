import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core'
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

export default function PurchaseOrderProducts({
  purchaseOrder,
}) {
  const [purchaseOrderProducts, setPurchaseOrderProducts] = useState([])
  const classes = useStyles()

  useEffect(() => {
    const findProducts = async () => {
      const { data } =  await api.get(`purchase/order/${purchaseOrder.id}/products`)

      setPurchaseOrderProducts(data.productsPurchaseOrder)
    }

    findProducts()
  }, [purchaseOrder])

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <h3>Fornecedor: Maranhão Colhões</h3>
        <Typography>Nº do pedido: {purchaseOrder.id}</Typography>
        <Typography>Valor: {purchaseOrder.value}</Typography>
        <Typography>Observação: {purchaseOrder.observation}</Typography>
      </div>

      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Qtd Bipou</TableCell>
              <TableCell align='right'>R$ Unitário</TableCell>
              <TableCell align='right'>R$ Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrderProducts?.map((product, i) => (
              <TableRow hover key={i}>
                <TableCell>{product.item}</TableCell>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.quantityArrived}</TableCell>
                <TableCell align='right'>
                  {product.value.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                </TableCell>
                <TableCell align='right'>
                  {product.total.toLocaleString('pt-br', {minimumFractionDigits: 2})}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
