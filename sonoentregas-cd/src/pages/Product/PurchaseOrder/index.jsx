import React, { useState } from 'react'
import { Box,
  Button,
  Dialog,
  Fab,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Search as SearchIcon, Add } from '@material-ui/icons'

import useStyles from '../style'
import Modal from '../../../components/Modal'
import CreateUpdatePurchaseOrder from './CreateUpdatePurchaseOrder'
import PurchaseOderProducts from './PurchaseOrderProducts'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function PurchaseOrder() {
  const [openPurchaseOrderProducts, setOpenPurchaseOrderProducts] = useState(false)
  const [openPurchaseCreateUpdate, setOpenPurchaseCreateUpdate] = useState(true)
  const [noteSelected, setNoteSelected] = useState()
  const [search, setSearch] = useState()
  const [typeSearch, setTypeSearch] = useState('noteNumber')
  const [purchaseOrders, setPurchaseOrders] = useState([])

  const classes = useStyles()

  const searchPurchaseOrder = () => {
    try {
      console.log(search)

      setPurchaseOrders([
        {
          status: 'pedente',
          supplier: 'Maranhão Colchões',
          noteNumber: 12345,
          purchaseNumber: 12345,
          issue: '01/04/2024',
          release: '01/04/2024',
          timeRelease: '05:05:05',
          valueTotal: '10.800,00',
          products: [
            { 
              code: '123-4',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-5',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
            { 
              code: '123-6',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            },
        ] },
        {
          status: 'pedente',
          supplier: 'Maranhão Colchões',
          noteNumber: 12346,
          purchaseNumber: 12346,
          issue: '01/04/2024',
          release: '01/04/2024',
          timeRelease: '05:05:05',
          valueTotal: '10.800,00',
          products: [
            { 
              code: '123-4',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            }
        ] },
        {
          status: 'pedente',
          supplier: 'Maranhão Colchões',
          noteNumber: 12347,
          purchaseNumber: 12347,
          issue: '01/04/2024',
          release: '01/04/2024',
          timeRelease: '05:05:05',
          valueTotal: '10.800,00',
          products: [
            { 
              code: '123-4',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            }
        ] },
        {
          status: 'pedente',
          supplier: 'Maranhão Colchões',
          noteNumber: 12348,
          purchaseNumber: 12348,
          issue: '01/04/2024',
          release: '01/04/2024',
          timeRelease: '05:05:05',
          valueTotal: '10.800,00',
          products: [
            { 
              code: '123-4',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            }
        ] },
        {
          status: 'pedente',
          supplier: 'Maranhão Colchões',
          noteNumber: 12349,
          purchaseNumber: 12349,
          issue: '01/04/2024',
          release: '01/04/2024',
          timeRelease: '05:05:05',
          valueTotal: '10.800,00',
          products: [
            { 
              code: '123-4',
              name: 'Base sued chocolate bordada 100X200X21',
              quantity: 2,
              quantityBeeped: 1,
              unitValue: '900,00',
              valueTotal: '1.800,00',
            }
        ] },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectPurchaseOrder = purchaseOrder => {
    setNoteSelected(purchaseOrder)
    setOpenPurchaseOrderProducts(true)
  }

  return (
    <Box>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>Tipo</InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            onChange={e => setTypeSearch(e.target.value)}
            defaultValue={typeSearch}
          >
            <MenuItem value={'noteNumber'}>Nº Nota</MenuItem>
            <MenuItem value={'dateIssue'}>Emissão</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            type={typeSearch === 'dateIssue' ? "date": "text"}
            placeholder="Pesquisar…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchPurchaseOrder}>Pesquisar</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell>Status</TableCell>
              <TableCell>Nº da nota</TableCell>
              <TableCell>Nº do pedido</TableCell>
              <TableCell>Emissão</TableCell>
              <TableCell align="right">Lançamento</TableCell>
              <TableCell align="right">Hora lançamento</TableCell>
              <TableCell align="right">R$ Total Nota</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((purchaseOrder, i) => (
              <TableRow key={i}>
                <TableCell>{purchaseOrder.status}</TableCell>
                <TableCell
                  onClick={() => handleSelectPurchaseOrder(purchaseOrder)}
                  style={{ cursor: 'pointer'}}
                >{purchaseOrder.noteNumber}</TableCell>
                <TableCell>{purchaseOrder.purchaseNumber}</TableCell>
                <TableCell>{purchaseOrder.issue}</TableCell>
                <TableCell align="right">{purchaseOrder.release}</TableCell>
                <TableCell align="right">{purchaseOrder.timeRelease}</TableCell>
                <TableCell align="right">{purchaseOrder.valueTotal}</TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Fab 
        color="primary"
        onClick={() => setOpenPurchaseCreateUpdate(true)}
      >
        <Add />
      </Fab>

      <Modal
        title={'Notas de entrada'}
        open={openPurchaseOrderProducts}
        setOpen={setOpenPurchaseOrderProducts}
      >
        <PurchaseOderProducts
          setOpen={setOpenPurchaseOrderProducts}
          note={noteSelected}
          type={'view'}
        />

      </Modal>

      <Dialog
        fullScreen
        open={openPurchaseCreateUpdate}
        onClose={() => setOpenPurchaseCreateUpdate(false)}
        TransitionComponent={Transition}
      >
        <CreateUpdatePurchaseOrder
          setOpen={setOpenPurchaseCreateUpdate}
        />
      </Dialog>
    </Box>
  )
}