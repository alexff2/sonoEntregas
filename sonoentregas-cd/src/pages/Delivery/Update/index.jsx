import React, { useEffect } from 'react'
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

function AppBarTitle({ type }) {
  return (
    <Typography variant='h6' align='center' style={{ padding: '12px 0' }}>
      Atualização de {type === 'forecast' ? 'Previsão' : 'Rota'}
    </Typography>
  );
}

function SalesTable({ sales }) {
  return (
    <Box padding={4}>
      <Table sales={sales} />
    </Box>
  );
}


export default function Update(){
  const { forecasts } = useForecasts()
  const { delivery: deliveries } = useDelivery()
  const { type, id } = useParams()
  const navigate = useNavigate()

  const data = type === 'forecast'
    ? forecasts.find(forecast => forecast.id === parseInt(id))
    : deliveries.find(delivery => delivery.ID === parseInt(id))

  useEffect(() => {
    if (!forecasts.length) {
      navigate('/app/delivery');
    }
  }, [forecasts, navigate])

  return (
    <Box component={Paper}>
      <AppBar position='relative'>
        <AppBarTitle type={type} />
      </AppBar>

      <Header data={data} type={type} />

      <Divider />

      <SalesTable sales={data?.sales ?? []} />
    </Box>
  )
}