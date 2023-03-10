import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@material-ui/core'
import { EditSharp, Send } from '@material-ui/icons'

import Modal from '../../../components/Modal'
import Confirm from '../../../components/Confirm'
import ForecastView from '../Modals/ModalView/ForecastView'

import { useForecasts } from '../../../context/forecastsContext'
import { useAlert } from '../../../context/alertContext'

import { getDateBr, getObjDate } from '../../../functions/getDates'
import StyleStatus from '../../../functions/styleStatus'
import api from '../../../services/api'

const useStyle = makeStyles(theme => ({
  headCell: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold
  },
  body: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      padding: 0
    },
    '& td': {
      padding: '4px 16px'
    }
  }
}))

const Status = ({date, status}) => {
  const timezoneForecast = getObjDate(date).setHours(0,0,0,0)
  const timezoneNow = new Date().setHours(0,0,0,0)

  if (status) {
    if (timezoneForecast < timezoneNow) {
      return <div style={StyleStatus('Vencida')}>Vencida</div>
    } else {
      return <div style={StyleStatus('Em previsão')}>Em previsão</div>
    }
  } else if (status === null) {
    return <div style={StyleStatus('Em lançamento')}>Em lançamento</div>
  } else {
    return <div 
      style={StyleStatus('Finalizada')}
    >Finalizada</div>
    
  }
}

export default function TabForecast() {
  const [ openConfirm, setOpenConfirm ] = useState(false)
  const [ progress, setProgress ] = useState(false)
  const [ openModalForecasView, setOpenModalForecastView ] = useState(false)
  const [ idForecastToSend, setIdForecastToSend ] = useState('')
  const [ forecastSelect, setForecastSelect ] = useState({})

  const { forecasts, setForecasts } = useForecasts([])
  const { setAlert } = useAlert()
  const classes = useStyle()
  const navigate = useNavigate()

  const handleStartedForecast = async () => {
    try {
      setProgress(true)

      await api.put(`/forecast/${idForecastToSend}/started`)

      const newForecasts = forecasts.map(forecast => {
        forecast.status = true

        const newSales = forecast.sales.map(sale => {
          sale.canRemove = false

          return sale
        })

        forecast.sales = newSales

        return forecast
      })

      setForecasts(newForecasts)

      setOpenConfirm(false)

      setProgress(false)
    } catch (e) {
      if (!e.response){
        console.log(e)

        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)

        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
  }

  const handleClickSendForecast = id => {
    setIdForecastToSend(id)
    setOpenConfirm(true)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
          {['Código', 'Descrição', 'Status'].map((value, index) => (
            <TableCell className={classes.headCell} key={index}>{value}</TableCell>
          ))}
            <TableCell  className={classes.headCell} colSpan={2}/>
          </TableRow>
        </TableHead>

        <TableBody>
          {forecasts?.map( forecast => (
            <TableRow key={forecast.id} className={classes.body}>
              <TableCell>{forecast.id}</TableCell>
              <TableCell width={'50%'}>
                {`Previsão do dia ${getDateBr(forecast.date)}`}
              </TableCell>
              <TableCell onClick={() => {
                setForecastSelect(forecast)
                setOpenModalForecastView(true)
              }}>
                <Status date={forecast.date} status={forecast.status} />
              </TableCell>

              <TableCell>
                <Tooltip title='Atualizar previsão'>
                  <IconButton onClick={() => navigate(`update/forecast/${forecast.id}`)}>
                    <EditSharp/>
                  </IconButton>
                </Tooltip>
                <Tooltip title='Enviar previsão para as lojas'>
                  <IconButton onClick={() => handleClickSendForecast(forecast.id)}>
                    <Send/>
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Confirm
        open={openConfirm}
        setOpen={setOpenConfirm}
        handleClick={handleStartedForecast}
        progress={progress}
      />

      <Modal
        open={openModalForecasView}
        setOpen={setOpenModalForecastView}
        title={"Visualização"}
      >
        <ForecastView 
          forecast={forecastSelect}
        />
      </Modal>
    </TableContainer>
  )
}