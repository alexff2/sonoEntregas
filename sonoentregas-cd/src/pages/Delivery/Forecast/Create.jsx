import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  makeStyles,
  Button,
  Paper,
  Divider,
  AppBar
} from '@material-ui/core'

import api from '../../../services/api'

import { ButtonSuccess, ButtonCancel } from '../../../components/Buttons'
import Table from './Table'

const stateInicialBooleans = {
  isDisabledHeader: false,
  renderComponent: false,
  isDisableBtnSave: false,
}

const stateInitialForecast = {
  id: 0,
  description: '',
  date: new Date().toISOString().slice(0, 10),
  sales: [],
}

const useStyles = makeStyles(theme => ({
  divFormControl: {
    display: 'flex',
    alignItems: 'center',
    gap: 20
  },
  description: {
    flex: '1',
  },
}))

export default function Create() {
  const [stateBoolean, setStateBoolean] = useState(stateInicialBooleans)
  const [forecast, setForecast] = useState(stateInitialForecast)
  const { id } = useParams()
  const navigate = useNavigate()

  const classes = useStyles()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForecast(state => ({
      ...state,
      [name]: value
    }))
  }

  const handleSubmitSave = async () => {
    if (forecast.description === '') {
      alert('Preencha a descrição')
      return
    }
    try {
      setStateBoolean(state => ({ ...state,  isDisableBtnSave: true }))
      /* Chamada para cadastrar*/

      setForecast(state => ({
        ...state,
        id: 11326,
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setStateBoolean(state => ({
        ...state,
        isDisabledHeader: true,
        isDisableBtnSave: true
      }))
    }
  }

  const handleCancel = () => {
    if(forecast.id === 0) {
      navigate('/app/delivery')
      return
    }

    setStateBoolean(state => ({
      ...state,
      isDisabledHeader: !state.isDisabledHeader
    }))
  }

  const handleEditHeader = () => {
    setStateBoolean(state => ({
      ...state,
      isDisabledHeader: false,
      isDisableBtnSave: false
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      if(id !== '0') {
      }

      setStateBoolean(state => ({
        ...state,
        renderComponent: true
      }))
    }

    fetchData()
  }, [id])

  if(!stateBoolean.renderComponent) {
    return (
      <Box padding={2}>
        <Typography variant="h6" gutterBottom>
          Carregando ...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <AppBar position='relative'>
        <Typography variant='h6' align='center' style={{ padding: '12px 0' }}>
          {forecast.id === 0 ? 'Nova Previsão' : 'Atualização de Previsão'}
        </Typography>
      </AppBar>
      <Box padding={2} component={Paper}>
        <Box className={classes.divFormControl}>
          <TextField
            label="Data"
            type="date"
            variant="outlined"
            disabled={stateBoolean.isDisabledHeader}
            name="date"
            value={forecast.date}
            onChange={handleChange}
          />

          <TextField
            name="description"
            label="Descrição"
            placeholder="Descrição da Previsão"
            variant="outlined"
            className={classes.description}
            disabled={stateBoolean.isDisabledHeader}
            value={forecast.description}
            onChange={handleChange}
          />
        </Box>

        <Box pt={2}>
          {!stateBoolean.isDisabledHeader
            ? <>
                <ButtonSuccess loading={stateBoolean.isDisableBtnSave} onClick={handleSubmitSave}>Gravar</ButtonSuccess>
                <ButtonCancel disabled={stateBoolean.isDisabledHeader} onClick={handleCancel}>Cancelar</ButtonCancel>
              </>
            : <Button variant='outlined' onClick={handleEditHeader}>Editar</Button>
          }
        </Box>

        <Divider style={{margin: '20px 0'}}/>

        {stateBoolean.isDisabledHeader && (
          <Table id={forecast.id} />
        )}
      </Box>
    </>
  )
}
