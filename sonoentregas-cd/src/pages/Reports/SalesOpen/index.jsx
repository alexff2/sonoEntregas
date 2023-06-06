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

import api from '../../../services/api'

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
  const [ typeSearch, setTypeSearch ] = useState('DESC')
  const [ typeShop, setTypeShop ] = useState('all')
  const [ search, setSearch ] = useState('')
  const [ onlyGreaterThan10, setOnlyGreaterThan10 ] = useState(false)
  const [ onlyDifGreaterThan1, setOnlyDifGreaterThan1 ] = useState(false)
  const [ onlyLateSales, setOnlyLateSales ] = useState(false)
  const [ sales, setSales ] = useState([])
  const navigate = useNavigate()
  const classe = useStyle()

  const currentDate = new Date()
  const dateTimeBr = currentDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

  useEffect(() => {
    getSales()
  },[])

  const getSales = async () => {
    const { data } = await api.get('reports/sales/open')
    setSales(data)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const headCells = [
    {id: 'ID_SALES', label: 'DAV'},
    {id: 'NOMECLI', label: 'DESCRIÇÃO'},
    {id: 'EMISSAO', label: 'EMISSÃO'},
    {id: 'DIAS_EMIS', label: 'DIAS'},
    {id: 'D_ENVIO', label: 'DATA ENVIO'},
    {id: 'DIAS_ENVIO', label: 'DIAS'},
    {id: 'DIF_DIAS', label: '# DIAS'},
    {id: 'SHOP', label: 'LOJA'},
  ]

  let salesFiltered = sales

  if (typeSearch === 'DESC') {
    salesFiltered = salesFiltered.filter(sale => sale.NOMECLI.includes(search))
  }

  if (typeSearch === 'COD') {
    salesFiltered = salesFiltered.filter(sale => sale.ID_SALES.toString().includes(search))
  }

  if (typeShop !== 'all') {
    salesFiltered = salesFiltered.filter(sale => sale.SHOP.includes(typeShop))
  }

  if (onlyGreaterThan10) {
    salesFiltered = salesFiltered.filter(sale => sale.DIAS_EMIS > 10)
  }

  if (onlyDifGreaterThan1) {
    salesFiltered = salesFiltered.filter(sale => sale.DIF_DIAS > 1)
  }

  if (onlyLateSales) {
    salesFiltered = salesFiltered.filter(sale => sale.lateDays > 0)
  }

  let shops = []
  sales.forEach(sale => {
    const shop = shops.find(shop => shop === sale.SHOP)

    if (!shop) {
      shops = [...shops, sale.SHOP]
    }
  })

return(
  <Box  component={Paper} p={2}>
    <Typography
      component='h1'
      align='center'
    >
      Relatório de DAVs abertas
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
            <MenuItem value={'COD'}>Código</MenuItem>
            <MenuItem value={'DESC'}>Descrição</MenuItem>
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
            checked={onlyLateSales}
            onChange={e => setOnlyLateSales(e.target.checked)}
          />
        }
        className={classe.inputRoot}
        label="Somente atrasadas"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={onlyDifGreaterThan1}
            onChange={e => setOnlyDifGreaterThan1(e.target.checked)}
          />
        }
        className={classe.inputRoot}
        label="Diferença maior que 2"
      />

      <FormControl variant="outlined">
        <InputLabel id="fieldShop" className={classe.label}>Loja</InputLabel>
        <Select
          label="Loja"
          labelId="fieldShop"
          className={classe.fieldSearch}
          onChange={e => setTypeShop(e.target.value)}
          defaultValue={typeShop}
        >
          <MenuItem value={'all'}>Todas</MenuItem>
          {shops.map( shop => (
            <MenuItem value={shop} key={shop}>{shop}</MenuItem>
          ))}
        </Select>
      </FormControl>
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
          {stableSort(salesFiltered, getComparator(order, orderBy)).map((sale, i) => (
            <TableRow key={i} className={classe.rowBody}>
              <TableCell>{sale.ID_SALES}</TableCell>
              <TableCell>{sale.NOMECLI}</TableCell>
              <TableCell>{getDateBr(sale.EMISSAO)}</TableCell>
              <TableCell>{sale.DIAS_EMIS}</TableCell>
              <TableCell>{getDateBr(sale.D_ENVIO)}</TableCell>
              <TableCell>{sale.DIAS_ENVIO}</TableCell>
              <TableCell style={sale.DIF_DIAS > 1 ? {color: 'red'} : {color: 'black'}}>{sale.DIF_DIAS}</TableCell>
              <TableCell>{sale.SHOP}</TableCell>
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
          headCells={headCells}
          classe={classe}
        />
        <TableBody>
          {stableSort(salesFiltered, getComparator(order, orderBy)).map((sale, i) => (
            <TableRow key={i} className={classe.rowBody}>
              <TableCell>{sale.ID_SALES}</TableCell>
              <TableCell>{sale.NOMECLI}</TableCell>
              <TableCell>{getDateBr(sale.EMISSAO)}</TableCell>
              <TableCell>{sale.DIAS_EMIS}</TableCell>
              <TableCell>{getDateBr(sale.D_ENVIO)}</TableCell>
              <TableCell>{sale.DIAS_ENVIO}</TableCell>
              <TableCell style={sale.DIF_DIAS > 1 ? {color: 'red'} : {color: 'black'}}>{sale.DIF_DIAS}</TableCell>
              <TableCell>{sale.SHOP}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </ReportContainer>
  </Box>)
}