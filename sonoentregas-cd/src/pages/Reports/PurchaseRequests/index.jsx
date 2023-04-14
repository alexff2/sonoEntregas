import React, { useState, useEffect } from 'react'
import {
  Button,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  InputLabel,
  InputBase,
  Box,
  Paper,
  FormControlLabel
} from '@material-ui/core'

import { useNavigate } from 'react-router-dom'

import SearchIcon from '@material-ui/icons/Search'
import ReportContainer from '../../../components/Reports'
import EnhancedTableHead from '../../../components/EnhancedTableHead'

import { getComparator, stableSort } from '../../../functions/orderTable'
import { getDateBr } from '../../../functions/getDates'

import { useStyle } from '../style'

const dataTeste = [
  {CODIGOPEDIDO: 123, EMISSAO: '2023-04-10', DIAS_EMIS: 2, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 1, OBS: '' },
  {CODIGOPEDIDO: 123, EMISSAO: '2023-04-05', DIAS_EMIS: 7, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 1, OBS: '' },
  {CODIGOPEDIDO: 223, EMISSAO: '2023-04-01', DIAS_EMIS: 11, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 0, OBS: '' },
  {CODIGOPEDIDO: 146, EMISSAO: '2023-04-01', DIAS_EMIS: 9, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 0, OBS: '' },
  {CODIGOPEDIDO: 423, EMISSAO: '2023-04-01', DIAS_EMIS: 11, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 3, OBS: '' },
  {CODIGOPEDIDO: 223, EMISSAO: '2023-04-07', DIAS_EMIS: 5, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 2, OBS: '' },
  {CODIGOPEDIDO: 323, EMISSAO: '2023-04-07', DIAS_EMIS: 5, VALORBRUTO: 123.01, VALORCHEGADA: 123.01, CODALTERNATIVO: 2, OBS: '' },
]

//import api from '../../../services/api'

const BoxFlex = (props) => (
  <Box
    display='flex'
    alignItems={'center'}
    justifyContent={'space-between'}
    {...props}
  />
)

export default function SalesOpen(){
  const [ order, setOrder ] = useState('desc')
  const [ orderBy, setOrderBy ] = useState('DIAS_EMIS')
  const [ openReport, setOpenReport ] = useState(false)
  const [ typeSearch, setTypeSearch ] = useState('COD_PED')
  const [ search, setSearch ] = useState('')
  const [ onlyGreaterThan10, setOnlyGreaterThan10 ] = useState(false)
  const [ purchaseRequests, setPurchaseRequests ] = useState(dataTeste)
  const navigate = useNavigate()
  const classe = useStyle()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const headCells = [
    {id: 'CODIGOPEDIDO', label: 'PEDIDO'},
    {id: 'EMISSAO', label: 'EMISSÃO'},
    {id: 'DIAS_EMIS', label: 'DIAS'},
    {id: 'VALORBRUTO', label: 'VALOR'},
    {id: 'VALORCHEGADA', label: 'VL CHEGOU'},
    {id: 'CODALTERNATIVO', label: 'PED FORNECEDOR'},
    {id: 'OBS', label: 'OBSERVAÇÃO'},
  ]

  const headCellsReport = [
    {id: 'CODIGOPEDIDO', label: 'PEDIDO'},
    {id: 'EMISSAO', label: 'EMISSÃO'},
    {id: 'DIAS_EMIS', label: 'DIAS'},
    {id: 'VALORBRUTO', label: 'VALOR'},
    {id: 'VALORCHEGADA', label: 'VL CHEGOU'},
    {id: 'CODALTERNATIVO', label: 'PED FOR'},
    {id: 'OBS', label: 'OBSERVAÇÃO'},
  ]

  var purchaseRequestsFiltered = purchaseRequests

  if (typeSearch === 'COD_PED') {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.CODIGOPEDIDO.toString().includes(search))
  }

  if (typeSearch === 'COD_FOR') {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.CODALTERNATIVO.toString().includes(search))
  }

  if (onlyGreaterThan10) {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.DIAS_EMIS > 10)
  }

  useEffect(() => {
    setPurchaseRequests(dataTeste)
  },[])

return(
  <Box  component={Paper} p={2}>
    <Typography
      component='h1'
      align='center'
    >
      Relatório de Pedidos de compra abertas
    </Typography>

    <BoxFlex mt={2} mb={2}>
      <Button variant='contained' color='primary' onClick={() => navigate('/app/reports')}>Voltar</Button>
      <Button variant='contained' color='primary' onClick={() => setOpenReport(true)}>PDF</Button>
    </BoxFlex>

    <Box className={classe.barHeader}>
      <BoxFlex>
        <FormControl variant="outlined">
          <InputLabel id="fieldSearch" className={classe.label}>Tipo</InputLabel>
          <Select
            label="Tipo"
            labelId="fieldSearch"
            className={classe.fieldSearch}
            onChange={e => setTypeSearch(e.target.value)}
            defaultValue={typeSearch}
          >
            <MenuItem value={'COD_PED'}>Código</MenuItem>
            <MenuItem value={'COD_FOR'}>Cod Fornecedor</MenuItem>
          </Select>
        </FormControl>
        <div className={classe.search}>
          <div className={classe.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            placeholder="Pesquisar…"
            classes={{
              root: classe.inputRoot,
              input: classe.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button className={classe.btnSearch}>Pesquisar</Button>
      </BoxFlex>

      <FormControlLabel
        control={
          <Checkbox
            checked={onlyGreaterThan10}
            onChange={e => setOnlyGreaterThan10(e.target.checked)}
          />
        }
        className={classe.inputRoot}
        label="Maior que 10 dias"
      />
    </Box>

    <TableContainer>
      <Table>
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headCells={headCells}
          classe={classe}
        />
        <TableBody>
          {stableSort(purchaseRequestsFiltered, getComparator(order, orderBy)).map((item, i) => (
            <TableRow key={i} className={classe.rowBody}>
              <TableCell>{item.CODIGOPEDIDO}</TableCell>
              <TableCell>{getDateBr(item.EMISSAO)}</TableCell>
              <TableCell>{item.DIAS_EMIS}</TableCell>
              <TableCell>{item.VALORBRUTO}</TableCell>
              <TableCell>{item.VALORCHEGADA}</TableCell>
              <TableCell>{item.CODALTERNATIVO}</TableCell>
              <TableCell>{item.OBS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de DAVs Abertas.pdf`}
    >
      <Typography align='center'>
        Relatório de DAVs abertas
      </Typography>

      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCellsReport}
            classe={classe}
          />
          <TableBody>
            {stableSort(purchaseRequestsFiltered, getComparator(order, orderBy)).map((item, i) => (
              <TableRow key={i} className={classe.rowBody}>
                <TableCell>{item.CODIGOPEDIDO}</TableCell>
                <TableCell>{getDateBr(item.EMISSAO)}</TableCell>
                <TableCell>{item.DIAS_EMIS}</TableCell>
                <TableCell>{item.VALORBRUTO}</TableCell>
                <TableCell>{item.VALORCHEGADA}</TableCell>
                <TableCell>{item.CODALTERNATIVO}</TableCell>
                <TableCell>{item.OBS}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportContainer>
  </Box>)
}