import React, { useState } from 'react'
import {
  Box,
  Button,
  Collapse,
  Fab,
  FormControl,
  IconButton,
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
  TableRow,
  Tooltip,
} from '@material-ui/core'
import { Add, Search as SearchIcon, KeyboardArrowDown, KeyboardArrowUp, EditSharp, Print } from '@material-ui/icons'

import useStyles from '../style'

import api from '../../../services/api'

import { useBackdrop } from '../../../context/backdropContext'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'

import { getDateSql } from '../../../functions/getDates'

import Modal from '../../../components/Modal'
import ModalCreateUpdate from './ModalCreateUpdate'
import ShowProducts from './ShowProducts'
import Report from './Report'

export const CellStatus = ({ children }) => {
  return (
    <TableCell>
      <Box 
        style={
          children === 'P' 
          ? {
              background: '#FD4659',
              textAlign: 'center',
              color: '#FFF',
            }
          : {
              background: '#32BF84',
              textAlign: 'center',
              color: '#FFF',
            }
        }
      >
        { children }
      </Box>
    </TableCell>
  )
}

const Row = ({ transfer, handleOpenCreateUpdate, transferPrint }) => {
  const [openTableProducts, setOpenTableProducts] = useState(false)

  return(
    <React.Fragment>
      <TableRow style={{backgroundColor: `${transfer.type === 'D' ? '#FFa5c033' : '#91c78433'}`}}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpenTableProducts(!openTableProducts)}>
            {openTableProducts ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <CellStatus>{transfer.status}</CellStatus>
        <TableCell>{transfer.id}</TableCell>
        <TableCell>{transfer.issue}</TableCell>
        <TableCell>{transfer.originId} - {transfer.origin}</TableCell>
        <TableCell>{transfer.destinyId} - {transfer.destiny}</TableCell>
        <TableCell>{transfer.reason}</TableCell>
        <TableCell>{transfer.observation}</TableCell>
        <TableCell>{transfer.user}</TableCell>
        <TableCell style={{ display: 'flex' }}>
          <Tooltip title='Atualizar Transferência'>
            <IconButton onClick={() => handleOpenCreateUpdate(transfer)}>
              <EditSharp />
            </IconButton>
          </Tooltip>
          {
            transfer.type === 'D' && (
              <Tooltip title='Imprimir Transferência'>
                <IconButton onClick={() => transferPrint(transfer)}>
                  <Print />
                </IconButton>
              </Tooltip>
            )
          }
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}></TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={openTableProducts} timeout="auto" unmountOnExit>
            <ShowProducts products={transfer.products} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function Transfer() {
  const [ openModalCreateUpdate, setOpenModalCreateUpdate ] = useState(false)
  const [ openModalPrinter, setOpenModalPrinter ] = useState(false)
  const [ transfers, setTransfers ] = useState([])
  const [ selectTransfer, setSelectTransfer ] = useState(null)
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('id')

  const classes = useStyles()
  const { setOpenBackDrop } = useBackdrop()
  const { setAlertSnackbar } = useAlertSnackbar()

  const searchTransferProduct = async () => {
    setOpenBackDrop(true)
    try {
      if (search === '') {
        setAlertSnackbar('Digite a pesquisa')
        return
      }

      const { data } = await api.get('transfer', {
        params: {
          type: typeSearch,
          search
        }
      })
      setTransfers(data)
      setOpenBackDrop(false)
    } catch (error) {
      setAlertSnackbar('Error no servidor entre em contato com administrador')
      setOpenBackDrop(false)
      console.log(error)
    }
  }

  const handleOpenCreateUpdate = transfer => {
    setOpenModalCreateUpdate(true)
    setSelectTransfer(transfer)
  }

  const transferPrint = transfer => {
    setSelectTransfer(transfer)
    setOpenModalPrinter(true)
  }

  const handleChangeTypeSearch = e => {
    e.target.value === 'id' ? setSearch('') : setSearch(getDateSql())

    setTypeSearch(e.target.value)
  }

  return (
    <Box>
      <Box className={classes.barHeader}>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classes.label}>Tipo</InputLabel>
          <Select
            label="Opções"
            labelId="fieldSearch"
            className={classes.fieldSearch}
            value={typeSearch}
            onChange={handleChangeTypeSearch}
            defaultValue={typeSearch}
          >
            <MenuItem value={'id'}>Nº Transf.</MenuItem>
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchTransferProduct()}
          />
        </div>

        <Button className={classes.btnSearch} onClick={searchTransferProduct}>Pesquisar</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow className={classes.rowHeader}>
              <TableCell></TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Emissão</TableCell>
              <TableCell>Origem</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Nº Ent</TableCell>
              <TableCell>Observação</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map( transfer => (
              <Row
                key={transfer.id}
                transfer={transfer}
                handleOpenCreateUpdate={handleOpenCreateUpdate}
                transferPrint={transferPrint}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab
        color="primary"
        className={classes.btnAdd}
        onClick={() => handleOpenCreateUpdate(null)}
      >
        <Add />
      </Fab>

      <Modal
        title={selectTransfer ? 'Atualização de transferência': 'Criação de transferência'}
        open={openModalCreateUpdate}
        setOpen={setOpenModalCreateUpdate}
      >
        <ModalCreateUpdate
          transferUpdate={selectTransfer}
          setTransfers={setTransfers}
          setOpen={setOpenModalCreateUpdate}
        />
      </Modal>

      <Modal
        open={openModalPrinter}
        setOpen={setOpenModalPrinter}
      >
        <Report
          transferToPrint={selectTransfer}
          onClose={() => setOpenModalPrinter(false)}
        />
      </Modal>
    </Box>
  )
}
