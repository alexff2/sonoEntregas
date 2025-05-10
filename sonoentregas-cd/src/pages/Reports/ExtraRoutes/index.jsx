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
import TableEmployees from './TableEmployees'
import ModalReport from './ModalReport'

export default function ExtraRoutes(){
  const [ isOpenFilter, setIsOpenFilter ] = useState(true)
  const [ isOpenReport, setIsOpenReport ] = useState(false)
  const [ dateSelect, setDateSelect ] = useState('')
  const [ extraRoutes, setExtraRoutes ] = useState({})
  const { setAlertSnackbar } = useAlertSnackbar()

  const navigate = useNavigate()

  const handleFilterReport = async ({ dateStart, dateEnd }) => {
    try {
      if (dateStart === '' || dateEnd === '') {
        setAlertSnackbar('Data inicial e final são obrigatórias')
        return
      }

      const { data } = await api.get('reports/extra-routes', {
        params: {
          dateStart,
          dateEnd
        }
      })

      setDateSelect(getDateBr(dateStart) + ' à ' + getDateBr(dateEnd))
      setExtraRoutes(data.extraRoutes)
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
        Relatório de Rotas extra / Assistentes e Motoristas
      </Typography>

      <Typography component='p' align='center' style={{marginBottom: 20}}>
        Período {dateSelect}
      </Typography>

      <Box display='flex' alignItems={'center'} justifyContent={'space-between'}>
        <Button variant='contained' color='primary' onClick={() => navigate('/app/reports')}>Voltar</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenFilter(true)}>Nova Consulta</Button>
        <Button variant='contained' color='primary' onClick={() => setIsOpenReport(true)}>PDF</Button>
      </Box>

      { extraRoutes.assistants && extraRoutes.assistants.length > 0 &&
        <TableEmployees
          employees={extraRoutes.assistants}
          title={'Rotas extras por Assistentes'}
        />
      }

      { extraRoutes.drivers && extraRoutes.drivers.length > 0 &&
        <TableEmployees
          employees={extraRoutes.drivers}
          title={'Rotas extras por Motoristas'}
        />
      }

      <ModalReport
        openReport={isOpenReport}
        setOpenReport={setIsOpenReport}
        extrasRoutes={extraRoutes}
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