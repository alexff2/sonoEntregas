import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Divider
} from '@material-ui/core'

import Table from './Table'
import Header from './Header'

import { useForecasts } from '../../../context/forecastsContext'
import { useDelivery } from '../../../context/deliveryContext'
import api from '../../../services/api'

function AppBarTitle({ type }) {
  return (
    <Typography variant='h6' align='center' style={{ padding: '12px 0' }}>
      Atualização de {type === 'forecast' ? 'Previsão' : 'Rota'}
    </Typography>
  );
}

export default function Update(){
  const [ sales, setSales ] = useState([])
  const { forecasts } = useForecasts()
  const { delivery: deliveries } = useDelivery()
  const { type, id } = useParams()
  const navigate = useNavigate()

  const data = type === 'forecast'
    ? forecasts.find(forecast => forecast.id === parseInt(id))
    : deliveries.find(delivery => delivery.ID === parseInt(id))

  useEffect(() => {
    const getForecast = async () => {
      try {
        const { data: forecast } = await api.get(`/forecast/${id}/view`)

        setSales(forecast === '' ? [] : forecast.sales)
      } catch (error) {
        console.log(error)
      }
    }

    const getDelivery = async () => {
      try {
        const { data: delivery } = await api.get(`/delivery/${id}/sales/view`)

        setSales(delivery.sales)
      } catch (error) {
        console.log(error)
      }
    }

    if (!forecasts.length) {
      navigate('/app/delivery');
      return
    }

    type === 'forecast' ? getForecast() : getDelivery()
  }, [forecasts, navigate, id, type])

  return (
    <Box component={Paper}>
      <AppBar position='relative'>
        <AppBarTitle type={type} />
      </AppBar>

      <Header data={data} type={type} />

      <Divider />

      <Box padding={4}>
        <Table sales={sales} setSales={setSales} />
      </Box>
    </Box>
  )
}