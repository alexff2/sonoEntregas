import React, { useState } from 'react'
import { Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'

import useStyles from '../style'
import Modal from '../../../components/Modal'
import ModalNotesProducts from './ModalNotesProducts'

export default function PurchaseNotes() {
  const [ openModalNotesProducts, setOpenModalNotesProducts ] = useState(false)
  const [ noteSelected, setNoteSelected ] = useState()
  const [ search, setSearch ] = useState()
  const [ typeSearch, setTypeSearch ] = useState('noteNumber')
  const [ purchase, setPurchase ] = useState([])

  const classes = useStyles()

  const searchNoteEntry = () => {
    try {
      console.log(search)

      setPurchase([
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

  const handleSelectNote = note => {
    setNoteSelected(note)
    setOpenModalNotesProducts(true)
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

        <Button className={classes.btnSearch} onClick={searchNoteEntry}>Pesquisar</Button>
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
            {purchase.map((entryProductsNote, i) => (
              <TableRow key={i}>
                <TableCell>{entryProductsNote.status}</TableCell>
                <TableCell
                  onClick={() => handleSelectNote(entryProductsNote)}
                  style={{ cursor: 'pointer'}}
                >{entryProductsNote.noteNumber}</TableCell>
                <TableCell>{entryProductsNote.purchaseNumber}</TableCell>
                <TableCell>{entryProductsNote.issue}</TableCell>
                <TableCell align="right">{entryProductsNote.release}</TableCell>
                <TableCell align="right">{entryProductsNote.timeRelease}</TableCell>
                <TableCell align="right">{entryProductsNote.valueTotal}</TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        title={'Notas de entrada'}
        open={openModalNotesProducts}
        setOpen={setOpenModalNotesProducts}
      >
        <ModalNotesProducts
          setOpen={setOpenModalNotesProducts}
          note={noteSelected}
          type={'view'}
        />
      </Modal>
    </Box>
  )
}