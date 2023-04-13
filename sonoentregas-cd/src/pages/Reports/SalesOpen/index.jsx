import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Input,
  InputLabel,
  InputBase,
  Box,
  Paper
} from '@material-ui/core'

import { useNavigate } from 'react-router-dom'

import SearchIcon from '@material-ui/icons/Search'
import ReportContainer from '../../../components/Reports'
import EnhancedTableHead from '../../../components/EnhancedTableHead'

import { getComparator, stableSort } from '../../../functions/orderTable'
import { getDateBr } from '../../../functions/getDates'

import { useStyle } from '../style'

const dataTeste = [
  {ID_SALES: 123, NOMECLI: 'Alex3', EMISSAO: '2023-04-10', DIAS_EMIS: 2, D_ENVIO: '2023-04-11', DIAS_ENVIO: 1, DIF_DIAS: 1 },
  {ID_SALES: 123, NOMECLI: 'Alex2', EMISSAO: '2023-04-05', DIAS_EMIS: 7, D_ENVIO: '2023-04-06', DIAS_ENVIO: 6, DIF_DIAS: 1 },
  {ID_SALES: 123, NOMECLI: 'Alex1', EMISSAO: '2023-04-01', DIAS_EMIS: 11, D_ENVIO: '2023-04-01', DIAS_ENVIO: 11, DIF_DIAS: 0 },
  {ID_SALES: 123, NOMECLI: 'Alex3', EMISSAO: '2023-04-07', DIAS_EMIS: 5, D_ENVIO: '2023-04-09', DIAS_ENVIO: 3, DIF_DIAS: 2 },
]

//import api from '../../../services/api'

const BoxFlex = (props) => (
  <Box
    display='flex'
    alignItems={'center'}
    justifyContent={'space-between'}
    {...props}
  />)

export default function SalesOpen(){
  const [ order, setOrder ] = useState('desc')
  const [ orderBy, setOrderBy ] = useState('DIAS_EMIS')
  const [ openReport, setOpenReport ] = useState(false)
  const [ typeSearch, setTypeSearch ] = useState('DESC')
  const [ search, setSearch ] = useState(false)
  const [ onlyGreaterThan10, setOnlyGreaterThan10 ] = useState(false)
  const [ sales, setSales ] = useState(dataTeste)
  const navigate = useNavigate()
  const classe = useStyle()

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
  ]

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
      {/* <Button variant='contained' color='primary' onClick={() => setIsOpenFilter(true)}>Nova Consulta</Button> */}
      <Button variant='contained' color='primary' onClick={() => setOpenReport(true)}>PDF</Button>
    </BoxFlex>

    <Box className={classe.barHeader}>
      <FormControl variant="outlined">
        <InputLabel id="fieldSeach" className={classe.label}>Tipo</InputLabel>
        <Select
          label="Tipo"
          labelId="fieldSeach"
          className={classe.fieldSeach}
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
          {stableSort(sales, getComparator(order, orderBy)).map((sale, i) => (
            <TableRow key={i} className={classe.rowBody}>
              <TableCell>{sale.ID_SALES}</TableCell>
              <TableCell>{sale.NOMECLI}</TableCell>
              <TableCell>{getDateBr(sale.EMISSAO)}</TableCell>
              <TableCell>{sale.DIAS_EMIS}</TableCell>
              <TableCell>{getDateBr(sale.D_ENVIO)}</TableCell>
              <TableCell>{sale.DIAS_ENVIO}</TableCell>
              <TableCell style={sale.DIF_DIAS > 1 ? {color: 'red'} : {color: 'black'}}>{sale.DIF_DIAS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        </TableFooter> */}
      </Table>
    </TableContainer>

    {/* <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de Cálculo de Estoque Ideal - ${month[selectedMonth]} / ${selectedYears}.pdf`}
    >
      <Typography align='center'>
        Relatório de DAVs abertas
      </Typography>

      <Typography align='center'>
        Mês/Ano base: { month[selectedMonth]} / {selectedYears}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={classe.rowHead}>
              {[
                'CÓDIGO',
                'DESCRIÇÃO',
                month1,
                month2,
                month3,
                'TOTAL',
                'M.TRI',
                'M.SEM',
                'PEND.',
                'EST/ASS',
                'PED',
                'COMP'
              ].map((th, i) => (
                <TableCell  color={'black'} key={i}>{th}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {productsFilter.map( product => (
            <TableRow key={product.COD_ORIGINAL} className={classe.rowBody}>
              <TableCell>{product.COD_ORIGINAL}</TableCell>
              <TableCell style={{fontSize: 10}}>{product.NOME}</TableCell>
              <TableCell>{product.QTD_MES1}</TableCell>
              <TableCell>{product.QTD_MES2}</TableCell>
              <TableCell>{product.QTD_MES3}</TableCell>
              <TableCell>{product.Tot}</TableCell>
              <TableCell>{product.MedMen}</TableCell>
              <TableCell>{product.MedSem}</TableCell>
              <TableCell>{product.PENDENTE}</TableCell>
              <TableCell>{product.EST_LOJA} / {product.EST_DEPOSITO}</TableCell>
              <TableCell>{product.PEDIDO}</TableCell>
              <TableCell>
                {product.Result}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className={classe.rowBody}>
            <TableCell colSpan={2}>TOTAIS</TableCell>
            <TableCell>{valueMonth1}</TableCell>
            <TableCell>{valueMonth2}</TableCell>
            <TableCell>{valueMonth3}</TableCell>
            <TableCell>{valueMonth1 + valueMonth2 + valueMonth3}</TableCell>
            <TableCell>{Math.floor((valueMonth1 + valueMonth2 + valueMonth3)/3)}</TableCell>
            <TableCell>{Math.floor((valueMonth1 + valueMonth2 + valueMonth3)/9)}</TableCell>
            <TableCell>{valuePend}</TableCell>
            <TableCell>{valueEstLoja} / {valueEstDep}</TableCell>
            <TableCell>{valuePed}</TableCell>
            <TableCell>
              {(Math.floor((valueMonth1 + valueMonth2 + valueMonth3)/9) + valuePend)-valueEstLoja-valuePed}
            </TableCell>
          </TableRow>
        </TableFooter>
        </Table>
      </TableContainer>
    </ReportContainer>
    */}
  </Box>)
}