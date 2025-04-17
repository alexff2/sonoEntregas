import React from 'react'
import {
  Typography,
  Box
} from '@material-ui/core'

import { dateAndTimeCurrent } from '../../../functions/getDates'
import ReportContainer from '../../../components/Reports'
import TableEmployees from './TableEmployees'

export default function ModalReport({
  extrasRoutes,
  date,
  openReport,
  setOpenReport
}){
  const { dateTimeBr } = dateAndTimeCurrent()
  return (
    <ReportContainer
      openModal={openReport}
      setOpenModal={setOpenReport}
      save={`Relatório de rotas extras por data - ${date}`}
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
          Relatório de rotas extras por data - {date}
        </Typography>

        <Typography component='p' align='center' style={{marginBottom: 20}}>
          Período: {date}
        </Typography>

        { extrasRoutes.assistants && extrasRoutes.assistants.length > 0 &&
          <TableEmployees
            employees={extrasRoutes.assistants}
            title={'Rotas extras por Assistente'}
          />
        }

        { extrasRoutes.drivers && extrasRoutes.drivers.length > 0 &&
          <TableEmployees
            employees={extrasRoutes.drivers}
            title={'Rotas extras por Lojas'}
          />
        }

      </Box>
    </ReportContainer>
  )
}