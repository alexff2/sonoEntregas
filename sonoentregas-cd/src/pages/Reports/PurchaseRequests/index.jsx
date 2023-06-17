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

import Modal from '../../../components/Modal'
import ReportContainer from '../../../components/Reports'
import EnhancedTableHead from '../../../components/EnhancedTableHead'
import BrMonetaryValue from '../../../components/BrMonetaryValue'
import PurchaseProducts from './PurchaseProducts'

import { getComparator, stableSort } from '../../../functions/orderTable'
import { getDateBr } from '../../../functions/getDates'

import { useStyle } from '../style'

import api from '../../../services/api'

const BoxFlex = (props) => (
  <Box
    display='flex'
    alignItems={'center'}
    justifyContent={'space-between'}
    {...props}
  />
)

export default function PurchaseRequests(){
  const [ order, setOrder ] = useState('desc')
  const [ orderBy, setOrderBy ] = useState('DIAS_EMIS')
  const [ openModal, setOpenModal ] = useState(false)
  const [ openReport, setOpenReport ] = useState(false)
  const [ typeSearch, setTypeSearch ] = useState('COD_PED')
  const [ search, setSearch ] = useState('')
  const [ onlyGreaterThan10, setOnlyGreaterThan10 ] = useState(false)
  const [ partial, setPartial ] = useState(false)
  const [ purchaseRequests, setPurchaseRequests ] = useState([])
  const [ purchaseSelect, setPurchaseSelect ] = useState({})
  const navigate = useNavigate()
  const classe = useStyle()

  const currentDate = new Date()
  const dateTimeBr = currentDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

  useEffect(() => {
    getPurchase()
  },[])

  const getPurchase = async () => {
    const { data } = await api.get('reports/purchase/requests')
    setPurchaseRequests(data)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const handleDialogProductPurchase = purchase => {
    setOpenModal(true)
    setPurchaseSelect(purchase)
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

  if (partial) {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.difValue !== item.VALORBRUTO)
  }

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
      <Button variant='contained' color='primary' onClick={() => getPurchase()}>Atualizar</Button>
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

      <FormControlLabel
        control={
          <Checkbox
            checked={partial}
            onChange={e => setPartial(e.target.checked)}
          />
        }
        className={classe.inputRoot}
        label="Parciais"
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
              <TableCell
                onClick={() =>handleDialogProductPurchase(item)}
                style={{ cursor: 'pointer'}}
              >{item.CODIGOPEDIDO}</TableCell>
              <TableCell>{getDateBr(item.EMISSAO)}</TableCell>
              <TableCell>{item.DIAS_EMIS}</TableCell>
              <TableCell>
                <BrMonetaryValue value={item.VALORBRUTO}/>
              </TableCell>
              <TableCell>
                <BrMonetaryValue value={item.VALOR_CHEGADA}/>
              </TableCell>
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
      <Typography>
        {dateTimeBr}
      </Typography>

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
                <TableCell>
                  <BrMonetaryValue value={item.VALORBRUTO}/>
                </TableCell>
                <TableCell>
                  <BrMonetaryValue value={item.VALOR_CHEGADA}/>
                </TableCell>
                <TableCell>{item.CODALTERNATIVO}</TableCell>
                <TableCell>{item.OBS}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportContainer>

    <Modal
      open={openModal}
      setOpen={setOpenModal}
      title={'Pedido de compra'}
    >
      <PurchaseProducts supplier={purchaseSelect} />
    </Modal>

  </Box>)
}