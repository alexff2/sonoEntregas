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

import { useBackdrop } from '../../../context/backdropContext'

import { getComparator, stableSort } from '../../../functions/orderTable'
import splitReportTable from '../../../functions/splitReportTable'
import { getDateBr, dateAndTimeCurrent } from '../../../functions/getDates'


import { useStyle } from '../style'
import tableStyle from './style'

import api from '../../../services/api'

const PageReport = ({ purchaseRequest, classesTable, pageNumber, order, orderBy, handleRequestSort, headCellsReport }) => {
  const { dateTimeBr } = dateAndTimeCurrent()

  return(
  <Box className="report">
    <Box display='flex' justifyContent='space-between' mb={1}>
      <Typography style={{ fontSize: 11 }}>{dateTimeBr}</Typography>
      <Typography style={{ fontSize: 11 }}>Pagina {pageNumber}</Typography>
    </Box>

    <TableContainer>
      <Table>
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          headCells={headCellsReport}
          classe={classesTable}
        />
        <TableBody>
          {purchaseRequest.map(( item, i) => (
            <TableRow key={i} className={classesTable.rowBody}>
              <TableCell>{item.CODIGOPEDIDO}</TableCell>
              <TableCell>{getDateBr(item.EMISSAO)}</TableCell>
              <TableCell>{item.DIAS_EMIS}</TableCell>
              <TableCell>{item.VALORBRUTO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>{item.VALOR_CHEGADA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>{item.FACTORY_DATA}</TableCell>
              <TableCell>{item.OBS}</TableCell>
            </TableRow>))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}

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
  const [ onlyGreaterThan5, setOnlyGreaterThan5 ] = useState(false)
  const [ partial, setPartial ] = useState(false)
  const [ purchaseRequests, setPurchaseRequests ] = useState([])
  const [ purchaseSelect, setPurchaseSelect ] = useState({})
  const navigate = useNavigate()
  const classe = useStyle()
  const classesTable = tableStyle.useStyle()
  const { setOpenBackDrop } = useBackdrop()

  const currentDate = new Date()
  const dateTimeBr = currentDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

  useEffect(() => {
    const getPurchaseNotes = async () => {
      setOpenBackDrop(true)
      const { data } = await api.get('reports/purchase/requests')
      setPurchaseRequests(data)
      setOpenBackDrop(false)
    }
    getPurchaseNotes()
  },[setOpenBackDrop])

  const getPurchase = async () => {
    setOpenBackDrop(true)
    const { data } = await api.get('reports/purchase/requests')
    setPurchaseRequests(data)
    setOpenBackDrop(false)
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
    {id: 'FACTORY_DATA', label: 'PED FORNECEDOR'},
    {id: 'OBS', label: 'OBSERVAÇÃO'},
  ]

  const headCellsReport = [
    {id: 'CODIGOPEDIDO', label: 'PEDIDO'},
    {id: 'EMISSAO', label: 'EMISSÃO'},
    {id: 'DIAS_EMIS', label: 'DIAS'},
    {id: 'VALORBRUTO', label: 'VALOR'},
    {id: 'VALORCHEGADA', label: 'VL CHEG', class: classesTable.headCellValuePurchase},
    {id: 'FACTORY_DATA', label: 'PED FOR', class: classesTable.headCellNumberPurchase},
    {id: 'OBS', label: 'OBSERVAÇÃO'},
  ]

  var purchaseRequestsFiltered = purchaseRequests

  if (typeSearch === 'COD_PED') {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.CODIGOPEDIDO.toString().includes(search))
  }

  if (typeSearch === 'COD_FOR') {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.CODALTERNATIVO.toString().includes(search))
  }

  if (onlyGreaterThan5) {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.DIAS_EMIS > 5)
  }

  if (partial) {
    purchaseRequestsFiltered = purchaseRequestsFiltered.filter(item => item.difValue !== item.VALORBRUTO)
  }

  let numberLinesHeader = 49, numberLinesBody = 51

  if (purchaseRequestsFiltered.length > 0) {
    purchaseRequestsFiltered.forEach((item, i) => {
      if (item.OBS !== null && item.OBS.length > 50) {
        if (i <= numberLinesHeader) {
          numberLinesHeader -= 1
        } else {
          numberLinesBody -= 1
        }
      }
    })
  }

  const purchaseRequestsFilteredReport = splitReportTable(purchaseRequestsFiltered, numberLinesBody, numberLinesHeader)

return(
  <Box  component={Paper} p={2}>
    <Typography
      component='h1'
      align='center'
    >
      Relatório de Pedidos de compra abertos
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
            checked={onlyGreaterThan5}
            onChange={e => setOnlyGreaterThan5(e.target.checked)}
          />
        }
        className={classe.inputRoot}
        label="Maior que 5 dias"
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
              <TableCell>{item.FACTORY_DATA}</TableCell>
              <TableCell>{item.OBS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de pedidos abertos`}
    >
      <Box className="report">
        <Box display='flex' justifyContent='space-between'>
          <Typography style={{ fontSize: 11 }}>{dateTimeBr}</Typography>
          <Typography style={{ fontSize: 11 }}>Pagina 1</Typography>
        </Box>

        <Typography align='center' style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }}>
          Relatório de pedidos abertos
        </Typography>

        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCellsReport}
              classe={classesTable}
            />
            <TableBody>
              {stableSort(purchaseRequestsFilteredReport[0], getComparator(order, orderBy)).map((item, i) => (
                <TableRow key={i} className={classesTable.rowBody}>
                  <TableCell>{item.CODIGOPEDIDO}</TableCell>
                  <TableCell>{getDateBr(item.EMISSAO)}</TableCell>
                  <TableCell>{item.DIAS_EMIS}</TableCell>
                  <TableCell>{item.VALORBRUTO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{item.VALOR_CHEGADA.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{item.FACTORY_DATA}</TableCell>
                  <TableCell>{item.OBS}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {purchaseRequestsFilteredReport.length > 1 && 
        purchaseRequestsFilteredReport.map(( purchaseRequest, i ) => {
          if (i !== 0) {
            return <PageReport 
              purchaseRequest={purchaseRequest}
              classesTable={classesTable}
              key={i}
              pageNumber={i+1}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
              headCellsReport={headCellsReport}
            />
          } else return null
        })}
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