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

import { useForecasts } from '../../../context/forecastsContext'
import { useDelivery } from '../../../context/deliveryContext'
import { getDateBr } from '../../../functions/getDates'

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

      <Box padding={4}>
        <strong>Descrição: </strong>
        { type === 'forecast' ? `Previsão de ${getDateBr(data?.date)}` : `${data?.ID} - ${data?.DESCRIPTION}`}
      </Box>

      <Divider />

      <SalesTable sales={data?.sales ?? []} />
    </Box>
  )
}