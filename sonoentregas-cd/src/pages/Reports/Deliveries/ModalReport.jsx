import React from 'react'
import {
  Typography,
  Box
} from '@material-ui/core'

import { dateAndTimeCurrent } from '../../../functions/getDates'
import ReportContainer from '../../../components/Reports'
import TableDeliveries from './TableDeliveries'

export default function ModalReport({
  deliveries,
  date,
  openReport,
  setOpenReport
}){
  const { dateTimeBr } = dateAndTimeCurrent()
  return (
    <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de Entregas por data - ${date} - ${deliveries.deliveryCd}`}
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
          Relatório de Entregas por data - {deliveries.deliveryCd}
        </Typography>

        <Typography component='p' align='center' style={{marginBottom: 20}}>
          Período: {date}
        </Typography>

        <TableDeliveries
          deliveries={deliveries.deliveriesByAssistants}
          title={'Entregas por Assistente'}
        />

        <TableDeliveries
          deliveries={deliveries.deliveriesByDriver}
          title={'Entregas por Motorista'}
        />

        <TableDeliveries
          deliveries={deliveries.deliveriesByStore}
          title={'Entregas por Lojas'}
        />

      </Box>
    </ReportContainer>
  )
}