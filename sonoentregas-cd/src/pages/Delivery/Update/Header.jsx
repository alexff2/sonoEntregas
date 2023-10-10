import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  makeStyles,
  Button
} from '@material-ui/core'

import api from '../../../services/api'

import { getDateBr } from '../../../functions/getDates'
import { useCars } from '../../../context/carsContext'
import { useDrivers } from '../../../context/driverContext'
import { useAssistants } from '../../../context/assistantContext'
import { useDelivery } from '../../../context/deliveryContext'
import { ButtonSuccess, ButtonCancel } from '../../../components/Buttons'


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

export default function Header({ data, type }) {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [codDriver, setCodDriver] = useState(0)
  const [codAssistant, setCodAssistant] = useState(0)
  const [codCar, setCodCar] = useState(0)
  const [disabled, setDisabled] = useState(true)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { setDelivery } = useDelivery()

  useEffect(() => {
    if (data) {
      const dateArray = data.D_MOUNTING.split('/')

      setDescription(data.DESCRIPTION)
      setDate(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
      setCodDriver(data.ID_DRIVER)
      setCodAssistant(data.ID_ASSISTANT)
      setCodCar(data.ID_CAR)
    }
  }, [data])

  const classes = useStyles()

  const handleSubmit = async () => {
    try {
      setDisabledBtn(!disabled)
      await api.put(`/delivery/${data.ID}/header`, {
        description,
        D_MOUNTING: date,
        ID_DRIVER: codDriver,
        ID_ASSISTANT: codAssistant,
        ID_CAR: codCar
      })

      const { data: dataDelivery } = await api.get('deliverys/status') 
      setDelivery(dataDelivery)

      setDisabled(!disabled)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = () => {
    setDisabled(!disabled)
    setDisabledBtn(!disabled)
  }

  return (
    <Box padding={2}>
      {type === 'forecast'
        ? <Typography variant='h6'>
          {`Previsão para o dia ${getDateBr(data?.date)}`}
        </Typography>
        :<div className={classes.divFormControl}>
          <TextField
            id="description"
            label="Descrição"
            placeholder="Descrição da entrega"
            style={{width: '52%'}}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={description}
            disabled={disabled}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            label="Data"
            type="date"
            variant="outlined"
            className={classes.formControl}
            disabled={disabled}
            value={date}
            style={{ width: 171}}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => setDate(e.target.value)}
          />

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="driverLabel">Motorista</InputLabel>
            <Select
              labelId="driverLabel"
              label="Motorista"
              id="driver"
              defaultValue={0}
              value={codDriver}
              onChange={(e) => setCodDriver(e.target.value)}
              disabled={disabled}
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
              value={codAssistant}
              onChange={(e) => setCodAssistant(e.target.value)}
              disabled={disabled}
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
              value={codCar}
              onChange={(e) => setCodCar(e.target.value)}
              disabled={disabled}
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
      }
      <Box pt={2}>
        {!disabled 
          ?<>
            <ButtonSuccess loading={disabledBtn} disabled={disabledBtn} onClick={handleSubmit}>Gravar</ButtonSuccess>
            <ButtonCancel disabled={disabled} onClick={handleCancel}>Cancelar</ButtonCancel>
          </>
          :<Button variant='outlined' onClick={handleCancel}>Editar</Button>}
      </Box>
    </Box>
  );
}