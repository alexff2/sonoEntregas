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

import splitReportTable from '../../../functions/splitReportTable'
import { dateAndTimeCurrent } from '../../../functions/getDates'

import { useStyle } from '../style'

import api from '../../../services/api'

const PageReport = ({ products, lastPage, result, classe, pageNumber, months }) => {
  const { dateTimeBr } = dateAndTimeCurrent()

  return(
  <Box className="report">
    <Box display='flex' justifyContent='space-between' mb={1}>
      <Typography style={{ fontSize: 11 }}>{dateTimeBr}</Typography>
      <Typography style={{ fontSize: 11 }}>Pagina {pageNumber}</Typography>
    </Box>

    <TableContainer>
      <Table>
        <TableHead>
          <TableRow className={classe.tableHead}>
            {[
              'CÓDIGO',
              'DESCRIÇÃO',
              months.month1,
              months.month2,
              months.month3,
              'TOTAL',
              'M.TRI',
              'PEND.',
              'ESTOQUE',
              'PED',
              'COMP'
            ].map((th, i) => (
              <TableCell  color={'black'} key={i}>{th}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(( product, i) => (
            <TableRow key={i} className={classe.rowBody}>
              <TableCell>{product.COD_ORIGINAL}</TableCell>
              <TableCell>{product.NOME}</TableCell>
              <TableCell>{product.QTD_MES1}</TableCell>
              <TableCell>{product.QTD_MES2}</TableCell>
              <TableCell>{product.QTD_MES3}</TableCell>
              <TableCell>{product.Tot}</TableCell>
              <TableCell>{product.MedMen}</TableCell>
              <TableCell>{product.PENDENTE}</TableCell>
              <TableCell>{product.EST_LOJA}</TableCell>
              <TableCell>{product.PEDIDO}</TableCell>
              <TableCell>
                {product.Result}
              </TableCell>
            </TableRow>))}
        </TableBody>
          {lastPage && (
            <TableFooter>
              <TableRow className={classe.rowBody}>
                <TableCell colSpan={2}>TOTAIS</TableCell>
                <TableCell>{result.valueMonth1}</TableCell>
                <TableCell>{result.valueMonth2}</TableCell>
                <TableCell>{result.valueMonth3}</TableCell>
                <TableCell>{result.valueMonth1 + result.valueMonth2 + result.valueMonth3}</TableCell>
                <TableCell>{Math.floor((result.valueMonth1 + result.valueMonth2 + result.valueMonth3)/3)}</TableCell>
                <TableCell>{result.valuePend}</TableCell>
                <TableCell>{result.valueEstLoja} / {result.valueEstDep}</TableCell>
                <TableCell>{result.valuePed}</TableCell>
                <TableCell>
                  {(Math.floor((result.valueMonth1 + result.valueMonth2 + result.valueMonth3)/3) + result.valuePend)-result.valueEstLoja-result.valuePed}
                </TableCell>
              </TableRow>
            </TableFooter>)}
      </Table>
    </TableContainer>
  </Box>
)}

export default function OrderSuggestion() {
  const { month, monthAbbreviated, years, currentMonth, currentYears, dateTimeBr } = dateAndTimeCurrent()

  const [ selectedYears, setSelectedYears ] = useState(currentYears)
  const [ selectedMonth, setSelectedMonth ] = useState(currentMonth - 1)
  const [ resultFilter, setResultFilter ] = useState('positives')
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
    month1 = monthAbbreviated[11]
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

  const productsFilter = (search.length  > 0 || resultFilter !== 'all')
    ? products.filter( prod => {
        if (resultFilter === 'positives') {
          if (prod.Result <= 0) {
            return false
          }
        } else if (resultFilter === 'negatives') {
          if (prod.Result >= 0) {
            return false
          }
        }

        if(prod.NOME.includes(search)){
          return true
        }

        return false
      })
    : products

  const result = {
    valueMonth1: 0,
    valueMonth2: 0,
    valueMonth3: 0,
    valuePend: 0,
    valueEstLoja: 0,
    valueEstDep: 0,
    valuePed: 0
  }

  for(var i = 0; i < productsFilter.length; i++) {
    result.valueMonth1 += productsFilter[i].QTD_MES1
    result.valueMonth2 += productsFilter[i].QTD_MES2
    result.valueMonth3 += productsFilter[i].QTD_MES3
    result.valuePend += productsFilter[i].PENDENTE
    result.valueEstLoja += productsFilter[i].EST_LOJA
    result.valuePed += productsFilter[i].PEDIDO
    productsFilter[i]['Tot'] = productsFilter[i].QTD_MES1 + productsFilter[i].QTD_MES2 + productsFilter[i].QTD_MES3
    productsFilter[i]['MedMen'] = Math.floor((productsFilter[i].QTD_MES1 + productsFilter[i].QTD_MES2 + productsFilter[i].QTD_MES3) / 3)
    productsFilter[i]['MedSem'] = Math.floor((productsFilter[i].QTD_MES1 + productsFilter[i].QTD_MES2 + productsFilter[i].QTD_MES3) / 3)
    productsFilter[i]['Result'] = (Math.floor((productsFilter[i].QTD_MES1 + productsFilter[i].QTD_MES2 + productsFilter[i].QTD_MES3)/3) + productsFilter[i].PENDENTE)-productsFilter[i].EST_LOJA-productsFilter[i].PEDIDO
  }

  const productsReport = splitReportTable(productsFilter, 49, 47)

  return (
    <Box component={Paper} p={2}>
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

        <Select
          value={resultFilter}
          onChange={e => {
            setResultFilter(e.target.value)
          }}
        >
          <MenuItem value={'all'}>Todos</MenuItem>
          <MenuItem value={'positives'}>Positivos</MenuItem>
          <MenuItem value={'negatives'}>Negativos</MenuItem>
        </Select>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={classe.tableHead}>
              {[
                'CÓDIGO',
                'DESCRIÇÃO',
                month1,
                month2,
                month3,
                'TOTAL',
                'MEDIA TRI',
                'PENDENTE',
                'ESTOQUE',
                'PEDIDO',
                'COMPRA'
              ].map((th, i) => (
                <TableCell key={i}>{th}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productsFilter.map( (product, i) => (
              <TableRow key={i} className={classe.rowBody}>
                <TableCell>{product.COD_ORIGINAL}</TableCell>
                <TableCell>{product.NOME}</TableCell>
                <TableCell>{product.QTD_MES1}</TableCell>
                <TableCell>{product.QTD_MES2}</TableCell>
                <TableCell>{product.QTD_MES3}</TableCell>
                <TableCell>{product.Tot}</TableCell>
                <TableCell>{product.MedMen}</TableCell>
                <TableCell>{product.PENDENTE}</TableCell>
                <TableCell>{product.EST_LOJA}</TableCell>
                <TableCell>{product.PEDIDO}</TableCell>
                <TableCell style={ product.Result < 0 ? {color: 'green'} : {color: 'red'}}>
                  {product.Result}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className={classe.rowBody}>
              <TableCell colSpan={2}>TOTAIS</TableCell>
              <TableCell>{result.valueMonth1}</TableCell>
              <TableCell>{result.valueMonth2}</TableCell>
              <TableCell>{result.valueMonth3}</TableCell>
              <TableCell>{result.valueMonth1 + result.valueMonth2 + result.valueMonth3}</TableCell>
              <TableCell>{Math.floor((result.valueMonth1 + result.valueMonth2 + result.valueMonth3)/3)}</TableCell>
              <TableCell>{result.valuePend}</TableCell>
              <TableCell>{result.valueEstLoja} / {result.valueEstDep}</TableCell>
              <TableCell>{result.valuePed}</TableCell>
              <TableCell>
                {(Math.floor((result.valueMonth1 + result.valueMonth2 + result.valueMonth3)/3) + result.valuePend)-result.valueEstLoja-result.valuePed}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <ReportContainer
        openModal={openReport}
        setOpenModal={setOpenReport}
        save={`Relatório de Cálculo de Estoque Ideal - ${month[selectedMonth]} / ${selectedYears}`}
      >
        <Box className="report">
          <Box display='flex' justifyContent='space-between'>
            <Typography style={{ fontSize: 11 }}>{dateTimeBr}</Typography>
            <Typography style={{ fontSize: 11 }}>Pagina 1</Typography>
          </Box>

          <Typography align='center' style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }}>
            Relatório de Cálculo de Estoque Ideal
          </Typography>

          <Typography align='center' style={{ fontSize: 12, color: '#000', fontWeight: 'bold' }}>
            Mês/Ano base: { month[selectedMonth]} / {selectedYears}
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={classe.tableHead}>
                  {[
                    'CÓDIGO',
                    'DESCRIÇÃO',
                    month1,
                    month2,
                    month3,
                    'TOTAL',
                    'M.TRI',
                    'PEND.',
                    'ESTOQUE',
                    'PED',
                    'COMP'
                  ].map((th, i) => (
                    <TableCell  color={'black'} key={i}>{th}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {productsReport[0].map( product => (
                  <TableRow key={product.COD_ORIGINAL} className={classe.rowBody}>
                    <TableCell>{product.COD_ORIGINAL}</TableCell>
                    <TableCell>{product.NOME}</TableCell>
                    <TableCell>{product.QTD_MES1}</TableCell>
                    <TableCell>{product.QTD_MES2}</TableCell>
                    <TableCell>{product.QTD_MES3}</TableCell>
                    <TableCell>{product.Tot}</TableCell>
                    <TableCell>{product.MedMen}</TableCell>
                    <TableCell>{product.PENDENTE}</TableCell>
                    <TableCell>{product.EST_LOJA}</TableCell>
                    <TableCell>{product.PEDIDO}</TableCell>
                    <TableCell>
                      {product.Result}
                    </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              { productsFilter.length <= 47 && <TableFooter>
                <TableRow className={classe.rowBody}>
                  <TableCell colSpan={2}>TOTAIS</TableCell>
                  <TableCell>{result.valueMonth1}</TableCell>
                  <TableCell>{result.valueMonth2}</TableCell>
                  <TableCell>{result.valueMonth3}</TableCell>
                  <TableCell>{result.valueMonth1 + result.valueMonth2 + result.valueMonth3}</TableCell>
                  <TableCell>{Math.floor((result.valueMonth1 + result.valueMonth2 + result.valueMonth3)/3)}</TableCell>
                  <TableCell>{result.valuePend}</TableCell>
                  <TableCell>{result.valueEstLoja} / {result.valueEstDep}</TableCell>
                  <TableCell>{result.valuePed}</TableCell>
                  <TableCell>
                    {(Math.floor((result.valueMonth1 + result.valueMonth2 + result.valueMonth3)/3) + result.valuePend)-result.valueEstLoja-result.valuePed}
                  </TableCell>
                </TableRow>
              </TableFooter>}
            </Table>
          </TableContainer>
        </Box>
        {productsReport.length > 1 && 
          productsReport.map(( products, i ) => {
            if (i !== 0) {
              return <PageReport 
                products={products}
                lastPage={productsReport.length - 1 === i}
                result={result}
                classe={classe}
                key={i}
                pageNumber={i+1}
                months={{
                  month1,
                  month2,
                  month3
                }}
              />
            } else return null
          })}
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