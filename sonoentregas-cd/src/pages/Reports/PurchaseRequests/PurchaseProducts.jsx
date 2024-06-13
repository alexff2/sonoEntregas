import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'

import BrMonetaryValue from '../../../components/BrMonetaryValue';

import { getDateBr } from '../../../functions/getDates'

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
});

export default function PurchaseRequestsProducts({ supplier }) {
  console.log(supplier)
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <h3>Fornecedor: {supplier.NOME_FOR}</h3>
        <p>Emissão: {getDateBr(supplier.EMISSAO)}</p>
        <p>Valor: <BrMonetaryValue value={supplier.VALORBRUTO}/> </p>
      </div>

      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Qtd Chegou</TableCell>
              <TableCell>Valor Unitário</TableCell>
              <TableCell>Valor Total Pedido</TableCell>
              <TableCell>Valor Total Chegou</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplier.products.map((produto, i) => (
              <TableRow hover key={i}>
                <TableCell>{produto.CODPRODUTO}</TableCell>
                <TableCell>{produto.NOME}</TableCell>
                <TableCell>{produto.QTE_PEDIDO}</TableCell>
                <TableCell>{produto.QTE_CHEGADA}</TableCell>
                <TableCell>
                  <BrMonetaryValue value={produto.VLUNITARIO} />
                </TableCell>
                <TableCell>
                  <BrMonetaryValue value={produto.QTE_PEDIDO * produto.VLUNITARIO}/>
                </TableCell>
                <TableCell>
                  <BrMonetaryValue value={produto.QTE_CHEGADA * produto.VLUNITARIO}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
