import React from 'react'
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  Box
} from '@material-ui/core'

import ReportContainer from '../../../components/Reports'

import splitReportTable from '../../../functions/splitReportTable'
import { dateAndTimeCurrent } from '../../../functions/getDates'

import { useStyle } from '../style'

const PageReport = ({ products, lastPage, result, classe, pageNumber }) => {
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
              'EST INI',
              'QTD ENT',
              'QTD SAI',
              'EST ATUAL'
            ].map((th, i) => (
              <TableCell style={{fontSize: 10}} color={'black'} key={i}>{th}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(( product, i) => (
            <TableRow key={i} className={classe.rowBody}>
              <TableCell>{product.ALTERNATI}</TableCell>
              <TableCell>{product.NOME}</TableCell>
              <TableCell>{product.EST_INI}</TableCell>
              <TableCell>{product.QTD_ENT}</TableCell>
              <TableCell>{product.QTD_SAI}</TableCell>
              <TableCell>{product.EST_ATUAL}</TableCell>
            </TableRow>))}
        </TableBody>
          {lastPage && (
            <TableFooter>
              <TableRow className={classe.rowBody}>
                <TableCell colSpan={2}>TOTAIS</TableCell>
                <TableCell>{result.inicialInventory}</TableCell>
                <TableCell>{result.input}</TableCell>
                <TableCell>{result.output}</TableCell>
                <TableCell>{result.finalInventory}</TableCell>
              </TableRow>
            </TableFooter>)}
      </Table>
    </TableContainer>
  </Box>
)}

export default function ModalReport({
  products,
  date,
  openReport,
  setOpenReport,
  result
}){
  const classe = useStyle()
  const { dateTimeBr } = dateAndTimeCurrent()

  const productsReport = splitReportTable(products, 51, 46)

  return (
    <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de Movimentação de produtos -${date.dateStart} a ${date.dateEnd}.pdf`}
    >
      <Box className="report">
        <Box display='flex' justifyContent='space-between' mb={1}>
          <Typography style={{ fontSize: 11 }}>{dateTimeBr}</Typography>
          <Typography style={{ fontSize: 11 }}>Pagina 1</Typography>
        </Box>

        <Typography
          component='h1'
          align='center'
        >
          Relatório de Movimentação de produtos
        </Typography>

        <Typography component='p' align='center' style={{marginBottom: 20}}>
          Período {date.dateStart} à {date.dateEnd}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className={classe.tableHead}>
                {[
                  'CÓDIGO',
                  'DESCRIÇÃO',
                  'EST INI',
                  'QTD ENT',
                  'QTD SAI',
                  'EST ATUAL'
                ].map((th, i) => (
                  <TableCell style={{fontSize: 10}} color={'black'} key={i}>{th}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {productsReport[0].map( product => (
              <TableRow key={product.ALTERNATI} className={classe.rowBody}>
                <TableCell>{product.ALTERNATI}</TableCell>
                <TableCell>{product.NOME}</TableCell>
                <TableCell>{product.EST_INI}</TableCell>
                <TableCell>{product.QTD_ENT}</TableCell>
                <TableCell>{product.QTD_SAI}</TableCell>
                <TableCell>{product.EST_ATUAL}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          { productsReport.length === 1 && <TableFooter>
            <TableRow className={classe.rowBody}>
              <TableCell colSpan={2}>TOTAIS</TableCell>
              <TableCell>{result.inicialInventory}</TableCell>
              <TableCell>{result.input}</TableCell>
              <TableCell>{result.output}</TableCell>
              <TableCell>{result.finalInventory}</TableCell>
            </TableRow>
          </TableFooter>}
          </Table>
        </TableContainer>
      </Box>
      {productsReport.length > 1 && productsReport.map((products, i) => {
        if (i !== 0) { 
          return <PageReport
                  key={i}
                  products={products}
                  lastPage={i === productsReport.length - 1}
                  result={result}
                  classe={classe}
                  pageNumber={i + 1}
                />}
        else return null
      })}
    </ReportContainer>
  )
}