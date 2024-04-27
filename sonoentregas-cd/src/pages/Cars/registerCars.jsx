import React, { useEffect, useState } from 'react'
import { Box, TextField } from '@material-ui/core'
import useStyles from './style'

import { ButtonCancel, ButtonSuccess } from '../../components/Buttons'
import ModalAlert from '../../components/ModalAlert'

import { useCars } from '../../context/carsContext'

import api from '../../services/api'

import { validateFields } from '../../functions/validateFields'

function RegisterCars({ 
    selectCar, setValue, setIsDisableFind, setIsDisableRegister, setIsDisableUpdate
  }) {
  const [ openMOdalAlert, setOpenModalAlert ] = useState(false)
  const [ childrenAlert, setChildrenAlert ] = useState()
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
        setChildrenAlert('Erro ao conectar com servidor, entre em contato com Administrador!')
        setOpenModalAlert(true)
        console.log(error)
      }
    } else {
      setChildrenAlert('Preencha todos os campos abaixo!')
      setOpenModalAlert(true)
    }
  }
  const updateCar = async () => {
    try {
      const car = { description, plate, model }

      const { data } = await api.put(`cars/${selectCar.ID}`, car)

      setCars( cars.map( item => item.ID === data.ID ? data : item ) )
      
      setChildrenAlert('Veículo alterado com sucesso!')
      setOpenModalAlert(true)
      
      setValue(0)
      setIsDisableFind(false)
      setIsDisableRegister(false)
      setIsDisableUpdate(true)
    } catch (error) {
      setChildrenAlert('Erro ao conectr com servidor, entre em contado com servidor!')
      setOpenModalAlert(true)
      console.log(error)
    }
  }
  const cancelRegister = () => {
    setValue(0)
  }
  const cancelUpdate = () => {
    setValue(0)
    setIsDisableFind(false)
    setIsDisableRegister(false)
    setIsDisableUpdate(true)
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
          <ButtonSuccess
            children={selectCar ? "Alterar" : "Cadastrar"}
            onClick={selectCar ? updateCar : registerCar}
          />
          <ButtonCancel 
            children="Cancelar"
            onClick={selectCar ? cancelUpdate : cancelRegister}
          />
        </Box>
      </form>
      <ModalAlert open={openMOdalAlert} setOpen={setOpenModalAlert}>{childrenAlert}</ModalAlert>
    </Box>
  )
}

export default RegisterCars;