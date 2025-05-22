import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  makeStyles,
  Button,
  Typography
} from '@material-ui/core'

import api from '../../../../services/api'

import { useAlertSnackbar } from '../../../../context/alertSnackbarContext'
import { ButtonSuccess, ButtonCancel } from '../../../../components/Buttons'
import { validateFieldsObject } from '../../../../functions/validateFields'

const useStyles = makeStyles(theme => ({
  divFormControl: {
    display: 'flex',
    alignItems: 'center'
  },
  formControl: {
    width: '15%',
    marginLeft: '1%'
  },
}))

export default function Header({ delivery, setDelivery, stateBoolean, setStateBoolean }) {
  const [loading, setLoading] = useState(false)

  const [cars, setCars ] = useState([])
  const [drivers, setDrivers ] = useState([])
  const [assistants, setAssistants ] = useState([])

  const { setAlertSnackbar } = useAlertSnackbar()

  const navigate = useNavigate()

  useEffect(() => {
    const searchUsers = async () => {
      const { data: usersResponse } = await api.get('users/0')
      const { data: carsResponse } = await api.get('cars')

      setCars(carsResponse)
      setDrivers(usersResponse.filter(user => user.OFFICE === 'Driver'))
      setAssistants(usersResponse.filter(user => user.OFFICE === 'Assistant'))

      setTimeout(() => {
        document.getElementById('description').focus()
      }, 500)
    }

    searchUsers()
  }, [setCars, setDrivers, setAssistants])

  const classes = useStyles()

  const changeDelivery = (key, value) => {
    if (key === 'ID_ASSISTANT' && delivery.ID_ASSISTANT2 === value) {
      setAlertSnackbar('Atenção! O mesmo auxiliar não pode ser selecionado duas vezes.')
      return
    }

    if (key === 'ID_ASSISTANT2' && delivery.ID_ASSISTANT === value) {
      setAlertSnackbar('Atenção! O mesmo auxiliar não pode ser selecionado duas vezes.')
      return
    }

    setDelivery({
      ...delivery,
      [key]: value
    })
  }

  const handleSubmitCreate = async () => {
    if (!validateFieldsObject({ ...delivery, ID: true, ID_ASSISTANT2: true})) {
      setAlertSnackbar('Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)

    try {
      const {data} = await api.post('/delivery', delivery)
      const issuedDate = data.D_MOUNTING.split('/')
      setDelivery({
        ...data,
        D_MOUNTING: `${issuedDate[2]}-${issuedDate[1]}-${issuedDate[0]}`,
      })
      setAlertSnackbar('Rota gravada com sucesso.', 'success')
      setStateBoolean(state => ({
        ...state,
        isEnableHeader: false
      }))
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setAlertSnackbar('Erro ao gravar rota.')
      console.log(error)
    }
  }

  const handleSubmitUpdate = async () => {
    setLoading(true)

    try {
      await api.put(`/delivery/${delivery.ID}/header`, {
        description: delivery.DESCRIPTION,
        D_MOUNTING: delivery.D_MOUNTING,
        ID_DRIVER: delivery.ID_DRIVER,
        ID_ASSISTANT: delivery.ID_ASSISTANT,
        ID_ASSISTANT2: delivery.ID_ASSISTANT2,
        ID_CAR: delivery.ID_CAR
      })

      const { data } = await api.get(`/delivery/${delivery.ID}/sales/view`)

      const issuedDate = data.D_MOUNTING.split('/')
      setDelivery({
        ...data,
        D_MOUNTING: `${issuedDate[2]}-${issuedDate[1]}-${issuedDate[0]}`,
      })
      setAlertSnackbar('Rota atualizada com sucesso.', 'success')
      setStateBoolean(state => ({
        ...state,
        isEnableHeader: false
      }))
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const toggleHeader = () => {
    if (delivery.ID === 0) {
      navigate('/app/delivery')
      return
    }
    setStateBoolean(state => ({
      ...state,
      isEnableHeader: !state.isEnableHeader
    }))
  }

  if (drivers.length === 0 || assistants.length === 0 || cars.length === 0) {
    return (
      <Box padding={2}>
        <div>
          <Typography variant="h6" gutterBottom>
            Carregando ...
          </Typography>
        </div>
      </Box>
    )
  }

  return (
    <Box padding={2}>
      <div>
        <div className={classes.divFormControl}>
          <TextField
            id="description"
            label="Descrição"
            placeholder="Descrição da rota"
            style={{width: '52%'}}
            variant="outlined"
            value={delivery?.DESCRIPTION}
            disabled={!stateBoolean.isEnableHeader}
            onChange={(e) => changeDelivery('DESCRIPTION', e.target.value)}
            required
          />
          <TextField
            label="Data"
            type="date"
            variant="outlined"
            style={{ width: 171}}
            className={classes.formControl}
            disabled={!stateBoolean.isEnableHeader}
            value={delivery?.D_MOUNTING}
            onChange={e => changeDelivery('D_MOUNTING', e.target.value)}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="driverLabel">Motorista</InputLabel>
            <Select
              labelId="driverLabel"
              label="Motorista"
              id="driver"
              value={delivery?.ID_DRIVER}
              onChange={(e) => changeDelivery('ID_DRIVER', e.target.value)}
              disabled={!stateBoolean.isEnableHeader}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {drivers.map( item => (
                <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="assistantLabel">Auxiliar</InputLabel>
            <Select
              labelId="assistantLabel"
              label="Auxiliar"
              id="assistant"
              value={delivery?.ID_ASSISTANT}
              onChange={(e) => changeDelivery('ID_ASSISTANT', e.target.value)}
              disabled={!stateBoolean.isEnableHeader}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {assistants.map( item => (
                <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="assistantLabel2">Auxiliar 2</InputLabel>
            <Select
              labelId="assistantLabel2"
              label="Auxiliar 2"
              id="assistant2"
              value={delivery?.ID_ASSISTANT2}
              onChange={(e) => changeDelivery('ID_ASSISTANT2', e.target.value)}
              disabled={!stateBoolean.isEnableHeader}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {assistants.map( item => (
                <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="carLabel">Veículo</InputLabel>
            <Select
              labelId="carLabel"
              id="car"
              label="Veículo"
              value={delivery?.ID_CAR}
              onChange={(e) => changeDelivery('ID_CAR', e.target.value)}
              disabled={!stateBoolean.isEnableHeader}
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              {cars.map( item => (
                <MenuItem key={item.ID} value={item.ID}>{item.DESCRIPTION}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Box pt={2}>
          {stateBoolean.isEnableHeader 
            ?<>
              { delivery.ID === 0
                 ? <ButtonSuccess loading={loading} onClick={handleSubmitCreate}>Criar</ButtonSuccess>
                 : <ButtonSuccess loading={loading} onClick={handleSubmitUpdate}>Atualizar</ButtonSuccess>
              }
              <ButtonCancel onClick={toggleHeader}>Cancelar</ButtonCancel>
            </>
            :<Button variant='outlined' onClick={toggleHeader}>Editar</Button>}
        </Box>
      </div>
    </Box>
  )
}