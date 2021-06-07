import React, { useEffect, useState } from 'react'
import { Box, makeStyles, TextField } from '@material-ui/core'
import { useCars } from '../../context/carsContext'
import { ButtonCancel, ButtonSucess } from '../../components/Buttons'

import api from '../../services/api'

import validateFields from '../../functions/validateFields'

const useStyles = makeStyles(() => ({
  boxfield: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  field: {
    width: '49%'
  }
}))

function RegisterCars({ 
    selectCar, setValue, setIsDesableFind, setIsDesableRegister, setIsDesableUpdate
  }) {
  const [ description, setDescription ] = useState()
  const [ plate, setPlate ] = useState()
  const [ model, setModel ] = useState()

  const { cars, setCars } = useCars()
  const classes = useStyles()

  useEffect(() => {
    setDescription(selectCar.DESCRIPTION)
    setPlate(selectCar.PLATE)
    setModel(selectCar.MODEL)
  },[selectCar])

  const registerCar = async () => {
    if (validateFields([description, plate, model])) {
      try {
        const car = { description, plate, model }
        
        const { data } = await api.post('cars', car)
        
        setCars([...cars, data])
        
        alert('Veículo cadastro com sucesso!')
        
        setValue(0)
      } catch (error) {
        alert(`Erro retornado: ${error}. Entre em contato com administrador do sistema`)
      }
    } else {
      alert("Preencha todos os campos!")
    }
  }
  const updateCar = async () => {
    try {
      const car = { description, plate, model }

      const { data } = await api.put(`cars/${selectCar.ID}`, car)

      setCars( cars.map( item => item.ID === data.ID ? data : item ) )
      
      alert('Veículo alterado com sucesso')
      
      setValue(0)
      setIsDesableFind(false)
      setIsDesableRegister(false)
      setIsDesableUpdate(true)
    } catch (error) {
      alert(`Erro retornado: ${error}. Entre em contato com administrador do sistema`)
    }
  }
  const cancelRegister = () => {
    setValue(0)
  }
  const cancelUpdate = () => {
    setValue(0)
    setIsDesableFind(false)
    setIsDesableRegister(false)
    setIsDesableUpdate(true)
  }
  return(
    <Box>
      <form>
        <TextField 
          id="description"
          label="Descrição"
          fullWidth
          margin="normal"
          variant="outlined"
          defaultValue={selectCar.DESCRIPTION ? selectCar.DESCRIPTION : ''}
          onChange={(e) => setDescription(e.target.value)}
          />
        <Box className={classes.boxfield}>
          <TextField 
            className={classes.field}
            id="plate"
            label="Placa"
            margin="normal"
            variant="outlined"
            defaultValue={selectCar.PLATE ? selectCar.PLATE : ''}
            onChange={(e) => setPlate(e.target.value)}
            />
          <TextField 
            className={classes.field}
            id="model"
            label="Modelo"
            margin="normal"
            variant="outlined"
            defaultValue={selectCar.MODEL ? selectCar.MODEL : ''}
            onChange={(e) => setModel(e.target.value)}
          />
        </Box>
        <Box mt={2}>
          <ButtonSucess
            children={selectCar ? "Alterar" : "Cadastrar"}
            onClick={selectCar ? updateCar : registerCar}
          />
          <ButtonCancel 
            children="Cancelar"
            onClick={selectCar ? cancelUpdate : cancelRegister}
          />
        </Box>
      </form>
    </Box>
  )
}

export default RegisterCars;