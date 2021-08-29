import React, { useEffect, useState } from "react"
import { 
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core"
import TableSales from './TableSales'
import { ButtonCancel, ButtonSucess } from '../../components/Buttons'

//context
import { useCars } from '../../context/carsContext'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'
import { useDelivery } from '../../context/deliveryContext'
import { useSale } from '../../context/saleContext'

import api from '../../services/api'

const useStyles = makeStyles(theme => ({
  //Style form select\
  divFormControl:{
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2)
  },
  formControl:{
    width: '30%'
  },
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default function ModalDelivery({ setOpen, selectDelivery, setCurrentDeliv, currentDeliv }){
  //States
  const [ description, setDescription ] = useState()
  const [ codCar, setCodCar ] = useState()
  const [ codDriver, setCodDriver ] = useState()
  const [ codAssistant, setCodAssistant ] = useState()
  const [ salesProd, setSalesProd ] = useState([])

  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { delivery, setDelivery } = useDelivery()
  const contextSales = useSale()

  //Styes
  const classes = useStyles()

  //Start component
  useEffect(() => {
    setDescription(selectDelivery.DESCRIPTION)
    setCodCar(selectDelivery.ID_CAR)
    setCodDriver(selectDelivery.ID_DRIVER)
    setCodAssistant(selectDelivery.ID_ASSISTANT)
  }, [selectDelivery])

  //Functions Outher
  const createDelivery = async () => {

    const data = {
      description, codCar, codDriver, codAssistant, salesProd, status: 'Em lançamento'
    }

    const { data: dataDelivery } = await api.post('deliverys', data)
    console.log(dataDelivery)
    
    setDelivery([...delivery, dataDelivery])
    setCurrentDeliv([...currentDeliv, dataDelivery])
    
    if (dataDelivery.ID) {
      const { data: dataSales } = await api.get('sales/false/false/Aberta')

      contextSales.setSales(dataSales)
    }
    
    setOpen(false)
  }

  const updateDelivery = async () => {
    try {
      const data = { description, codCar, codDriver, codAssistant }

      const { data: dataDelivery } = await api.put(`deliverys/${selectDelivery.ID}`, data)
      
      dataDelivery['sales'] = selectDelivery.sales
      
      setDelivery(delivery.map( item => item.ID === selectDelivery.ID ? dataDelivery : item))
      setCurrentDeliv(currentDeliv.map( item => item.ID === selectDelivery.ID ? dataDelivery : item))
      
      setOpen(false)
    } catch (e) {
      console.log(e)
      alert('Entre em contato com Administrador')
    }
  }

  //Component
  return(
    <form>
      <button type="button" onClick={() => console.log(salesProd)}>Teste</button>
      <TextField
        id="description"
        label="Descrição"
        placeholder="Descrição da entrega"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        defaultValue={selectDelivery ? selectDelivery.DESCRIPTION : ''}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className={classes.divFormControl}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="driverLabel">Motorista</InputLabel>
          <Select
            labelId="driverLabel"
            label="Motorista"
            id="driver"
            defaultValue={selectDelivery ? selectDelivery.ID_DRIVER : 0}
            onChange={(e) => setCodDriver(e.target.value)}
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
            defaultValue={selectDelivery ? selectDelivery.ID_ASSISTANT : 0}
            onChange={(e) => setCodAssistant(e.target.value)}
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
            defaultValue={selectDelivery ? selectDelivery.ID_CAR : 0}
            onChange={(e) => setCodCar(e.target.value)}
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

      <TableSales 
        selectSales={selectDelivery ? selectDelivery.sales : false} 
        setSalesProd={setSalesProd}
        salesProd={salesProd}
      />

      <div className={classes.btnActions}>
        <ButtonSucess 
          children={selectDelivery ? "Editar" : "Lançar"}
          className={classes.btnSucess}
          onClick={selectDelivery ? updateDelivery : createDelivery}
        />
        <ButtonCancel 
          children="Cancelar"
          onClick={() => setOpen(false)}
          className={classes.btnCancel}
        />
      </div>

    </form>
  )
}