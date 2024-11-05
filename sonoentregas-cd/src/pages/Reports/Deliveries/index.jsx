import React, { useState } from 'react'
import { 
  Box,
  Typography,
  Button,
} from '@material-ui/core'
import { useNavigate } from 'react-router-dom'

import { getDateBr } from '../../../functions/getDates'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'

import api from '../../../services/api'

import Filter from './Filter'
import TableDeliveries from './TableDeliveries'
import ModalReport from './ModalReport'


export default function Deliveries(){
  const [ isOpenFilter, setIsOpenFilter ] = useState(true)
  const [ isOpenReport, setIsOpenReport ] = useState(false)
  const [ dateSelect, setDateSelect ] = useState('')
  const [ deliveries, setDeliveries ] = useState({
    deliveriesByAssistants: [],
    deliveriesByDriver: [],
    deliveriesByStore: [],
    deliveryCd: ''
  })
  const { setAlertSnackbar } = useAlertSnackbar()

  const navigate = useNavigate()

  const handleFilterReport = async ({ dateStart, dateEnd }) => {
    try {
      if (dateStart === '' || dateEnd === '') {
        setAlertSnackbar('Data inicial e final são obrigatórias')
        return
      }

      const { data } = await api.get('reports/deliveries', {
        params: {
          dateStart,
          dateEnd
        }
      })

      setDateSelect(getDateBr(dateStart) + ' à ' + getDateBr(dateEnd))
      setDeliveries(data)
      setIsOpenFilter(false)
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
        Relatório de Entregas por data
      </Typography>

      <Typography component='p' align='center' style={{marginBottom: 20}}>
        Período {dateSelect}
      </Typography>

      <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>
        <Button variant='contained' color='primary' onClick={() => navigate('/app/reports')}>Voltar</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenFilter(true)}>Nova Consulta</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenReport(true)}>PDF</Button>
      </Box>

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

      <ModalReport
        openReport={isOpenReport}
        setOpenReport={setIsOpenReport}
        deliveries={deliveries}
        date={dateSelect}
      />

      <Filter
        open={isOpenFilter}
        setIsOpenFilter={setIsOpenFilter}
        handleFilterReport={handleFilterReport}
      />
    </Box>
  )
}