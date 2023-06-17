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
} from '@material-ui/core'

import ReportContainer from '../../../components/Reports'

import { useStyle } from '../style'

export default function ModalReport({
  products,
  date,
  openReport,
  setOpenReport 
}){
  const classe = useStyle()

  return (
    <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de Movimentação de produtos -${date.dateStart} a ${date.dateEnd}.pdf`}
    >
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
          {products.map( product => (
            <TableRow key={product.ALTERNATI} className={classe.rowBody}>
              <TableCell style={{fontSize: 10}}>{product.ALTERNATI}</TableCell>
              <TableCell style={{fontSize: 10}}>{product.NOME}</TableCell>
              <TableCell style={{fontSize: 10}}>{product.EST_INI}</TableCell>
              <TableCell style={{fontSize: 10}}>{product.QTD_ENT}</TableCell>
              <TableCell style={{fontSize: 10}}>{product.QTD_SAI}</TableCell>
              <TableCell style={{fontSize: 10}}>{product.EST_ATUAL}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className={classe.rowBody}>
            <TableCell colSpan={2}>TOTAIS</TableCell>
            <TableCell>{0}</TableCell>
            <TableCell>{0}</TableCell>
            <TableCell>{0}</TableCell>
            <TableCell>{0}</TableCell>
          </TableRow>
        </TableFooter>
        </Table>
      </TableContainer>
    </ReportContainer>
  )
}