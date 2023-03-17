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
import { EditSharp, Send, CheckCircle } from '@material-ui/icons'

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
  const [ forecastToSendFinished, setForecastToSendFinished ] = useState({})
  const [ forecastSelect, setForecastSelect ] = useState({ sales: []})

  const { forecasts, setForecasts } = useForecasts([])
  const { setAlert } = useAlert()
  const classes = useStyle()
  const navigate = useNavigate()

  const handleClickSendFinishedForecast = forecast => {
    setForecastToSendFinished(forecast)
    setOpenConfirm(true)
  }

  const handleStartedForecast = async () => {
    try {
      setProgress(true)

      await api.put(`/forecast/${forecastToSendFinished.id}/started`)

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

      setForecastToSendFinished({})

      setOpenConfirm(false)

      setProgress(false)
    } catch (e) {
      setOpenConfirm(false)

      setProgress(false)

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

  const handleInvalidationSale = async idSale => {
    try {
      await api.put(`/forecast/${forecastSelect.id}/sale/${idSale}/invalidation`)

      const newForecasts = forecasts.map(forecast => {
        if (forecast.id === forecastSelect.id) {
          const newSales = forecast.sales.map(sale => {
            if (sale.id === idSale) {
              sale.validationStatus = false
            }

            return sale
          })

          forecast.sales = newSales
        }

        return forecast
      })
 
      setForecasts(newForecasts)
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

  const handleFinishedForecast = async () => {
    try {
      setProgress(true)

      await api.put(`/forecast/${forecastToSendFinished.id}/finish`)

      setForecasts(forecasts.filter( forecast => forecast.id !== forecastToSendFinished.id))

      setForecastToSendFinished({})

      setOpenConfirm(false)

      setProgress(false)
    } catch (e) {
      setOpenConfirm(false)

      setProgress(false)

      if (!e.response){
        console.log(e)

        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)

        setAlert('Servidor')
      } else if (e.response.data.message === `There are confirmed sales in this forecast!`) {
        console.log(e.response.data.sales)

        setAlert('Existe vendas confirmadas nesta previsão que não foram para rota!')
      } else if (e.response.data.message === `There are unconfirmed sales in this forecast!`) {
        console.log(e.response.data.sales)

        setAlert('Existe vendas pendentes de confirmação nesta previsão!')
      } else {
        console.log(e.response.data)

        setAlert('Servidor')
      }
    }
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
                {(forecast.status === null || forecast.status) &&
                  <Tooltip title={forecast.status ? 'Finalizar Previsão' : 'Enviar previsão para as lojas'}>
                    <IconButton onClick={() => handleClickSendFinishedForecast(forecast)}>
                      { forecast.status
                        ? <CheckCircle />
                        : <Send/>
                      }
                    </IconButton>
                  </Tooltip>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Confirm
        open={openConfirm}
        setOpen={setOpenConfirm}
        handleClick={forecastToSendFinished.status === null ? handleStartedForecast : handleFinishedForecast}
        progress={progress}
      />

      <Modal
        open={openModalForecasView}
        setOpen={setOpenModalForecastView}
        title={`Visualização - ${forecastSelect.sales.length } vendas lançadas`}
      >
        <ForecastView 
          forecast={forecastSelect}
          handleInvalidationSale={handleInvalidationSale}
        />
      </Modal>
    </TableContainer>
  )
}