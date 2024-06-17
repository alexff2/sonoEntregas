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
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import { useBackdrop } from '../../../context/backdropContext'
import ModalNotesProducts from './ModalNotesProducts'
import api from '../../../services/api'

export default function PurchaseNotes() {
  const [ openModalNotesProducts, setOpenModalNotesProducts ] = useState(false)
  const [ noteSelected, setNoteSelected ] = useState()
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('docNumber')
  const [ purchaseNotes, setPurchaseNotes ] = useState([])

  const { setAlertSnackbar } = useAlertSnackbar()
  const { setOpenBackDrop } = useBackdrop()
  const classes = useStyles()

  const searchNoteEntry = async () => {
    setOpenBackDrop(true)

    try {
      const { data } = await api.get('purchase/notes', {
        params: {
          typeSearch,
          search
        }
      })

      setPurchaseNotes(data.purchaseNotes)
      setOpenBackDrop(false)
    } catch (error) {
      console.log(error)
      setAlertSnackbar('Erro interno!')
      setOpenBackDrop(false)
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
            value={typeSearch}
            onChange={e => setTypeSearch(e.target.value)}
          >
            <MenuItem value={'docNumber'}>Nº Nota</MenuItem>
            <MenuItem value={'issue'}>Emissão</MenuItem>
          </Select>
        </FormControl>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            type={typeSearch === 'issue' ? "date": "text"}
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
              <TableCell>Nº da nota</TableCell>
              <TableCell>Nº do pedido</TableCell>
              <TableCell>Emissão</TableCell>
              <TableCell align="right">Lançamento</TableCell>
              <TableCell align="right">Hora lançamento</TableCell>
              <TableCell align="right">R$ Total Nota</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseNotes.map((note, i) => (
              <TableRow key={i}>
                <TableCell
                  onClick={() => handleSelectNote(note)}
                  style={{ cursor: 'pointer'}}
                >{note.docNumber}</TableCell>
                <TableCell>{note.purchaseOrderId}</TableCell>
                <TableCell>{note.issue}</TableCell>
                <TableCell align="right">{note.release}</TableCell>
                <TableCell align="right">{note.releaseTime}</TableCell>
                <TableCell align="right">{note.value}</TableCell>
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