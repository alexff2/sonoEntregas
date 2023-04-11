import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
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
  Box,
  Paper
} from '@material-ui/core'
import { useNavigate } from 'react-router-dom'

import ReportContainer from '../../../components/Reports'

import { useStyle } from '../style'

import api from '../../../services/api'

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYears = currentDate.getFullYear()

const month = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]
const monthAbbreviated = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez'
]

const years = []

for(let i = 2020; i <= currentYears; i++) {
  years.push(i)
}

export default function OrderSuggestion() {
  const [ selectedYears, setSelectedYears ] = useState(currentYears)
  const [ selectedMonth, setSelectedMonth ] = useState(currentMonth - 1)
  const [ search, setSearch ] = useState('')
  const [ products, setProducts ] = useState([])
  const [ isOpenFilter, setIsOpenFilter ] = useState(true)
  const [ openReport, setOpenReport ] = useState(false)
  const [ disabledButton, setDisabledButton ] = useState(false)

  const classe = useStyle()

  const navigate = useNavigate()

  let month1
  let month2
  let month3
  month3 = monthAbbreviated[selectedMonth]

  if (selectedMonth === 0) {
    month1 = monthAbbreviated[10]
    month2 = monthAbbreviated[11]
  } else if (selectedMonth === 1) {
    month1 = monthAbbreviated[10]
    month2 = monthAbbreviated[selectedMonth-1]
  } else {
    month1 = monthAbbreviated[selectedMonth-2]
    month2 = monthAbbreviated[selectedMonth-1]
  }

  const checkMonthOfCurrentYears = indexMonth => {
    if (currentYears === selectedYears) {
      if (currentMonth <= indexMonth) {
        return true
      }
    }

    return false
  }

  const handleFilterReport = async () => {
    setDisabledButton(true)
    const { data } = await api.get('reports', {
      params: {
        monthBase: selectedMonth,
        yearBase: selectedYears
      }
    })

    setProducts(data)
    setIsOpenFilter(false)
    setDisabledButton(false)
  }

  const handleCloseFilter = () => setIsOpenFilter(false)

  const productsFilter = search.length > 0
    ? products.filter( prod => prod.NOME.includes(search))
    : products
  
  var valueMonth1 = 0
  var valueMonth2 = 0
  var valueMonth3 = 0
  var valuePend = 0
  var valueEstLoja = 0
  var valueEstDep = 0
  var valuePed = 0

  for(var i = 0; i < productsFilter.length; i++) {
    valueMonth1 += productsFilter[i].QTD_MES1
    valueMonth2 += productsFilter[i].QTD_MES2
    valueMonth3 += productsFilter[i].QTD_MES3
    valuePend += productsFilter[i].PENDENTE
    valueEstLoja += productsFilter[i].EST_LOJA
    valueEstDep += productsFilter[i].EST_DEPOSITO
    valuePed += productsFilter[i].PEDIDO
  }

  return (
    <Box  component={Paper} p={2}>
      <Typography
        component='h1'
        align='center'
      >
        Relatório de Cálculo de Estoque Ideal
      </Typography>

      <Typography>
        Mês/Ano base: { month[selectedMonth]} / {selectedYears}
      </Typography>

      <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>
        <Button variant='contained' color='primary' onClick={() => navigate('/app/reports')}>Voltar</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenFilter(true)}>Nova Consulta</Button>
        <Button variant='contained' color='primary' onClick={() => setOpenReport(true)}>PDF</Button>
      </Box>

      <Box  marginTop={2} marginBottom={2}>
        <Input placeholder='Pesquisa de produto!' onChange={e => setSearch(e.target.value)}/>
      </Box>

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
                'MEDIA TRI',
                'MEDIA SEM',
                'PENDENTE',
                'EST/ASS',
                'PEDIDO',
                'COMPRA'
              ].map((th, i) => (
                <TableCell key={i}>{th}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productsFilter.map( product => (
              <TableRow key={product.COD_ORIGINAL} className={classe.rowBody}>
                <TableCell>{product.COD_ORIGINAL}</TableCell>
                <TableCell>{product.NOME}</TableCell>
                <TableCell>{product.QTD_MES1}</TableCell>
                <TableCell>{product.QTD_MES2}</TableCell>
                <TableCell>{product.QTD_MES3}</TableCell>
                <TableCell>{product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3}</TableCell>
                <TableCell>{Math.floor((product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3)/3)}</TableCell>
                <TableCell>{Math.floor((product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3)/9)}</TableCell>
                <TableCell>{product.PENDENTE}</TableCell>
                <TableCell>{product.EST_LOJA} / {product.EST_DEPOSITO}</TableCell>
                <TableCell>{product.PEDIDO}</TableCell>
                <TableCell>
                  {(Math.floor((product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3)/12) + product.PENDENTE)-product.EST_LOJA-product.PEDIDO}
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
                {(Math.floor((valueMonth1 + valueMonth2 + valueMonth3)/12) + valuePend)-valueEstLoja-valuePed}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <ReportContainer
        openModal={openReport}
        setOpenModal={setOpenReport}
        save={`Relatório de Cálculo de Estoque Ideal - ${month[selectedMonth]} / ${selectedYears}.pdf`}
      >
        <Typography align='center'>
          Relatório de Cálculo de Estoque Ideal
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
                <TableCell>{product.NOME}</TableCell>
                <TableCell>{product.QTD_MES1}</TableCell>
                <TableCell>{product.QTD_MES2}</TableCell>
                <TableCell>{product.QTD_MES3}</TableCell>
                <TableCell>{product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3}</TableCell>
                <TableCell>{Math.floor((product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3)/3)}</TableCell>
                <TableCell>{Math.floor((product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3)/12)}</TableCell>
                <TableCell>{product.PENDENTE}</TableCell>
                <TableCell>{product.EST_LOJA} / {product.EST_DEPOSITO}</TableCell>
                <TableCell>{product.PEDIDO}</TableCell>
                <TableCell>
                  {(Math.floor((product.QTD_MES1 + product.QTD_MES2 + product.QTD_MES3)/12) + product.PENDENTE)-product.EST_LOJA-product.PEDIDO}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </ReportContainer>

      <Dialog
        open={isOpenFilter}
        onClose={handleCloseFilter}
      >
        <DialogTitle>
          Filtro por data:
        </DialogTitle>

        <DialogContent>
          <DialogContentText>Selecione o mês e o ano base!</DialogContentText>

          <Box display="flex" gap={2} marginTop={4}>
            <Select
              value={selectedMonth}
              onChange={e => setSelectedMonth(parseInt(e.target.value))}
            >
              { month.map((mes, i) => (
                <MenuItem value={i} key={i} disabled={checkMonthOfCurrentYears(i)}>{mes}</MenuItem>
              ))}
            </Select>

            <Select
              value={selectedYears}
              onChange={e => setSelectedYears(parseInt(e.target.value))}
            >
              {years.map( year => (
                <MenuItem value={year} key={year}>{year}</MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleFilterReport}
            color='secondary'
            variant='contained'
            disabled={disabledButton}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}