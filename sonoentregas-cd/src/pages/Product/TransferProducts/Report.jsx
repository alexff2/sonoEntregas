import React from 'react'
import {
  Box,
  Button,
  Divider,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import { useReactToPrint } from 'react-to-print'
import MonetaryValue from '../../../components/MonetaryValue'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
  report: {
    padding: theme.spacing(2),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    '& > div:nth-child(1)': {
      flex: 1,
      textAlign: "start",
    },
    '& > div:nth-child(2)': {
      flex: 2,
      textAlign: "center",
    },
    '& > div:nth-child(3)': {
      flex: 1,
      textAlign: "end",
    },
  },
  information: {
    margin: theme.spacing(2, 0),
    '& > *': {
      lineHeight: 1.2,
    }
  },
}))

export default function Report({ transferToPrint, onClose }) {
  const classes = useStyles()
  const documentReport = React.useRef(null)

  const handlePrint = useReactToPrint({
    content: () => documentReport.current,
    documentTitle: 'Comprovante de Entrega ',
    onAfterPrint: onClose,
  })

  const currentDateTime = new Date().toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <Box className={classes.root}>
      <Button
        onClick={handlePrint}
        variant='contained'
        color='secondary'
        style={{ marginBottom: '20px' }}
      >Imprimir</Button>

      <Box className={classes.report} ref={documentReport}>
        <Box className={classes.header}>
          <Box>
            <Typography>Data: {currentDateTime.split(',')[0]}</Typography>
            <Typography>Hora: {currentDateTime.split(',')[1]}</Typography>
          </Box>
          <Box>
            <Typography variant='h6'>Comprovante de Transferência</Typography>
            <Typography variant='h6'>Nº {transferToPrint?.id}</Typography>
          </Box>
          <Box>
            <Typography>Usuário: {transferToPrint.user}</Typography>
          </Box>
        </Box>

        <Divider style={{ margin: '8px 0' }} />

        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1'><strong>Origem:</strong> {transferToPrint?.origin}</Typography>
          <Typography variant='subtitle1'><strong>Emissão:</strong> {transferToPrint?.issue}</Typography>
        </Box>

        <Divider style={{ margin: '8px 0' }} />

        <Box className={classes.information}>
          <Typography variant='subtitle1'><strong>Destino:</strong> {transferToPrint?.destiny}</Typography>
          <Typography variant='subtitle1'><strong>End Dest:</strong> {transferToPrint?.destinyAddress}</Typography>
          <Typography variant='subtitle1'><strong>Observação:</strong> {transferToPrint?.observation}</Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Alternativo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align='center'>Quantidade</TableCell>
                <TableCell align='right'>Vl Unit</TableCell>
                <TableCell align='right'>Vl Tot</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transferToPrint.products.map((product, i) => (
                <TableRow key={i}>
                  <TableCell>{product.generalCode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align='center'>{product.quantity}</TableCell>
                  <TableCell align='right'>
                    <MonetaryValue>{product.purchasePrice}</MonetaryValue>
                  </TableCell>
                  <TableCell align='right'>
                    <MonetaryValue>
                      {(product.quantity * product.purchasePrice)}
                    </MonetaryValue>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} align='right'>Total:</TableCell>
                <TableCell colSpan={1} align='center'>
                  {transferToPrint.products.reduce((acc, product) => acc + product.quantity, 0)}
                </TableCell>
                <TableCell colSpan={2} align='right'>
                  <MonetaryValue>
                    {transferToPrint.products.reduce((acc, product) => acc + (product.quantity * product.purchasePrice), 0)}
                  </MonetaryValue>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <Box mt={8}>
          <Typography variant='subtitle1'>Assinatura do Recebedor</Typography>
          <Typography variant='subtitle1'>Nome: ________________________________________________________________________________________</Typography>
        </Box>
      </Box>
    </Box>
  )
}
