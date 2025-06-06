import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import useReport from './useReport'

const PendingProductsOutOfStockReport = () => {
  const { closeFilterDialog, fetchReportData, filterDialogOpen, data, printRef, handlePrint } = useReport()
  return (
    <>
      <Dialog
        open={filterDialogOpen}
        onClose={closeFilterDialog}
      >
        <DialogTitle>Filtros do relatório</DialogTitle>
        <Box padding={2}>
          <Typography variant="body1">Selecione a data para gerar o relatório.</Typography>
          <Box marginTop={2}>
            <Input
              type="date"
              onChange={(e) => fetchReportData(e.target.value)}
              style={{ width: '100%' }}
            />
          </Box>
        </Box>
        <Box padding={2}>
          <Typography variant="body1">Selecione a data limite da entrega das vendas.</Typography>
        </Box>
      </Dialog>
      {
        data.length > 0 ? (
          <>
            <Button variant='outlined' onClick={handlePrint}>Imprimir</Button>

            <Box margin={8} ref={printRef}>
              <h1>Relatório de Produtos Pendentes em Estoque/data</h1>
              <Typography>Este relatório exibi os produtos pendentes que não tem estoque disponível contendo Lote e Carga da fábrica.</Typography>
              <Table size='small' >
                <TableHead>
                  <TableRow style={{background: 'gray'}}>
                    <TableCell>Produto</TableCell>
                    <TableCell align='center'>Pedido</TableCell>
                    <TableCell align='center'>Qtd Pend</TableCell>
                    <TableCell>Carga/lote da Fábrica</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.DESCRICAO}</TableCell>
                      <TableCell align='center'>{item.PEDIDO}</TableCell>
                      <TableCell align='center'>{item.QTD}</TableCell>
                      <TableCell>{item.PED_LOTE_CARGA}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">Nenhum produto pendente encontrado.</Typography>
        )
      }
    </>
  )
}

export default PendingProductsOutOfStockReport