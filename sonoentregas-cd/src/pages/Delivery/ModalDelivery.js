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
    width: '49%'
  },
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default function ModalDelivery({ setOpen, selectDelivery }){
  //States
  const [ description, setDescription ] = useState()
  const [ codCar, setCodCar ] = useState()
  const [ codDriver, setCodDriver ] = useState()
  const [ sales, setSales ] = useState([])
  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { delivery, setDelivery } = useDelivery()
  const contextSales = useSale()

  //Styes
  const classes = useStyles()

  //Start component
  useEffect(() => {
    setDescription(selectDelivery.DESCRIPTION)
    setCodCar(selectDelivery.ID_CAR)
    setCodDriver(selectDelivery.ID_DRIVER)
    selectDelivery ? setSales(selectDelivery.sales) : setSales([])
  }, [selectDelivery])

  //Functions Outher
  const createDelivery = async () => {
    //back irá retortar data.... Por enquanto roda:
    const data = {
      description, codCar, codDriver, sales, status: 'Em lançamento'
    }

    const { data: dataDelivery } = await api.post('deliverys', data)
    
    setDelivery([...delivery, dataDelivery])
    
    if (dataDelivery.ID) {
      const { data: dataSales } = await api.get('sales')

      contextSales.setSales(dataSales)
    }
    
    setOpen(false)
  }
  const updateDelivery = async () => {
    try {
      const data = { description, codCar, codDriver }

      const { data: dataDelivery } = await api.put(`deliverys/${selectDelivery.ID}`, data)
      
      dataDelivery['sales'] = sales
      
      setDelivery(delivery.map( item => item.ID === selectDelivery.ID ? dataDelivery : item))
      
      setOpen(false)
    } catch (e) {
      console.log(e)
      alert('Entre em contato com Administrador')
    }
  }

  //Component
  return(
    <form>
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
        setSales={setSales}
        sales={sales}
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