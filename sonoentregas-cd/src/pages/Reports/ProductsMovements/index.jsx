import React, { useState } from 'react'
import { 
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableContainer
} from '@material-ui/core'
import { useNavigate } from 'react-router-dom'

import EnhancedTableHead from '../../../components/EnhancedTableHead'
import { getComparator, stableSort } from '../../../functions/orderTable'
import { getDateBr } from '../../../functions/getDates'

import { useStyle } from '../style'

import api from '../../../services/api'

import Filter from './Filter'
import ModalReport from './ModalReport'

const currentDate = new Date()

const dateTimeBr = currentDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
const arrayDate = dateTimeBr.split(' ')

const objDateTime =  {
  date: arrayDate[0].substring(0,10),
  time: arrayDate[1],
}

const headCells = [
  {id: 'ALTERNATI', label: 'CÓDIGO'},
  {id: 'NOME', label: 'DESCRIÇÃO'},
  {id: 'EST_INI', label: 'EST INI'},
  {id: 'QTD_ENT', label: 'EST ENT'},
  {id: 'QTD_SAI', label: 'EST SAI'},
  {id: 'EST_ATUAL', label: 'EST ATUAL'},
]

export default function ProductsMovement(){
  const [ order, setOrder ] = useState('desc')
  const [ orderBy, setOrderBy ] = useState('ALTERNATI')
  const [ isOpenFilter, setIsOpenFilter ] = useState(true)
  const [ disabledButton, setDisabledButton ] = useState(false)
  const [ isOpenReport, setIsOpenReport ] = useState(false)
  const [ dateSelect, setDateSelect ] = useState('')
  const [ products, setProducts ] = useState([])
  const navigate = useNavigate()
  const classe = useStyle()

  const result = {
    inicialInventory: 0,
    finalInventory: 0,
    input: 0,
    output: 0
  }

  for (let i = 0; i < products.length; i++) {
    result.inicialInventory += products[i].EST_INI
    result.finalInventory += products[i].EST_ATUAL
    result.input += products[i].QTD_ENT
    result.output += products[i].QTD_SAI
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  const handleFilterReport = async ({ date, typeMovement}) => {
    try {
      setDisabledButton(true)

      const { data } = await api.get('reports/products/movement', {
        params: {
          date,
          typeMovement
        }
      })

      setDateSelect(getDateBr(date))
      setProducts(data)
      setIsOpenFilter(false)
      setDisabledButton(false)
    } catch (e) {
      console.log(e)
    }
  }

  return(
    <Box>
      <Typography
        component='h1'
        align='center'
      >
        Relatório de Movimentação de produtos
      </Typography>

      <Typography component='p' align='center' style={{marginBottom: 20}}>
        Período {dateSelect !== '' ? dateSelect : objDateTime.date} à {objDateTime.date}
      </Typography>

      <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>
        <Button variant='contained' color='primary' onClick={() => navigate('/app/reports')}>Voltar</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenFilter(true)}>Nova Consulta</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenReport(true)}>PDF</Button>
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
            {stableSort(products, getComparator(order, orderBy)).map((item, i) => (
              <TableRow key={i} className={classe.rowBody}>
                <TableCell>{item.ALTERNATI}</TableCell>
                <TableCell>{item.NOME}</TableCell>
                <TableCell>{item.EST_INI}</TableCell>
                <TableCell>{item.QTD_ENT}</TableCell>
                <TableCell>{item.QTD_SAI}</TableCell>
                <TableCell>{item.EST_ATUAL}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className={classe.rowBody}>
              <TableCell colSpan={2}>TOTAIS</TableCell>
              <TableCell>{result.inicialInventory}</TableCell>
              <TableCell>{result.input}</TableCell>
              <TableCell>{result.output}</TableCell>
              <TableCell>{result.finalInventory}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Filter
        open={isOpenFilter}
        setIsOpenFilter={setIsOpenFilter}
        handleFilterReport={handleFilterReport}
        disabledButton={disabledButton}
      />

      <ModalReport
        products={products}
        date={{dateStart: dateSelect, dateEnd: objDateTime.date}}
        openReport={isOpenReport}
        setOpenReport={setIsOpenReport}
        result={result}
      />

    </Box>
  )
}