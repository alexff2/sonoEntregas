import React, { useState } from 'react'
import { Box, Button, Collapse, Fab, FormControl, IconButton, InputBase, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core'
import { Add, Search as SearchIcon, KeyboardArrowDown, KeyboardArrowUp, EditSharp } from '@material-ui/icons'

import useStyles from '../style'

import api from '../../../services/api'

import { useAlertSnackbar } from '../../../context/alertSnackbarContext'

import { getDateSql } from '../../../functions/getDates'

import Modal from '../../../components/Modal'
import ModalCreateUpdate from './ModalCreateUpdate'
import ShowProducts from './ShowProducts'

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

const Row = ({ transfer, handleOpenCreateUpdate }) => {
  const [openTableProducts, setOpenTableProducts] = useState(false)

  return(
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpenTableProducts(!openTableProducts)}>
            {openTableProducts ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <CellStatus>{transfer.status}</CellStatus>
        <TableCell>{transfer.code}</TableCell>
        <TableCell>{transfer.issue}</TableCell>
        <TableCell>{transfer.originId} - {transfer.origin}</TableCell>
        <TableCell>{transfer.destinyId} - {transfer.destiny}</TableCell>
        <TableCell>{transfer.reason}</TableCell>
        <TableCell>{transfer.observation}</TableCell>
        <TableCell>{transfer.user}</TableCell>
        <TableCell>
          <Tooltip title='Atualizar Transferência'>
            <IconButton onClick={() => handleOpenCreateUpdate(transfer)}>
              <EditSharp />
            </IconButton>
          </Tooltip>
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
  const [ transfers, setTransfers ] = useState([])
  const [ transferUpdate, setTransferUpdate ] = useState(null)
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('code')

  const classes = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()

  const searchTransferProduct = async () => {
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
    } catch (error) {
      setAlertSnackbar('Error no servidor entre em contato com administrador')
      console.log(error)
    }
  }

  const handleOpenCreateUpdate = transfer => {
    setOpenModalCreateUpdate(true)
    setTransferUpdate(transfer)
  }

  const handleChangeTypeSearch = e => {
    e.target.value === 'code' ? setSearch('') : setSearch(getDateSql())

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
            <MenuItem value={'code'}>Nº Transf.</MenuItem>
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
            value={search}
            onChange={e => setSearch(e.target.value)}
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
              <TableCell>Motivo</TableCell>
              <TableCell>Observação</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transfers.map( transfer => (
              <Row
                key={transfer.code}
                transfer={transfer}
                handleOpenCreateUpdate={handleOpenCreateUpdate}
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
        title={transferUpdate ? 'Atualização de transferência': 'Criação de transferência'}
        open={openModalCreateUpdate}
        setOpen={setOpenModalCreateUpdate}
      >
        <ModalCreateUpdate
          transferUpdate={transferUpdate}
          setTransfers={setTransfers}
          setOpen={setOpenModalCreateUpdate}
        />
      </Modal>
    </Box>
  )
}
