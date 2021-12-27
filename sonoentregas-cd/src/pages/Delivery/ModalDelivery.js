import React, { useEffect, useState } from "react"
import { 
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core"
import TableSales from '../../components/TableSales'
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
  divFormControl: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  formControl: {
    width: '30%'
  },
  divSearchSale: {
    display: 'flex',
    '& button': {
      margin: '16px 0 8px 16px',
      width: 100,
      background: theme.palette.primary.main,
      border: 'none',
      borderRadius: 4,
      color: 'white',
      cursor: 'pointer',
      opacity: '1',
      transition: '0.4s',
      '&:hover': {
        opacity: '0.7'
      } 
    }
  },
  error: {
    margin: '4px 0',
    padding: 4,
    backgroundColor: theme.palette.error.light,
    color: '#FFF'
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
  const [ codAssistant, setCodAssistant ] = useState()
  const [ idSale, setIdSale ] = useState('')
  const [ createDevSales, setCreateDevSales ] = useState([])
  const [ salesProd, setSalesProd ] = useState([])
  const [ errorMsg, setErrorMsg ] = useState('')

  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { delivery, setDelivery } = useDelivery()
  const { setSales } = useSale()

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
    try {

      const data = {
        description, codCar, codDriver, codAssistant, salesProd, status: 'Em lançamento'
      }

      const { data: dataDelivery } = await api.post('deliverys', data)

      setDelivery([...delivery, dataDelivery])

      if (dataDelivery.ID) { //Melhorar performace
        const { data: dataSales } = await api.get('sales/false/false/Aberta/null')
  
        setSales(dataSales)
      }

      setOpen(false)

    } catch (error) {
      alert('Erro ao cadastar Entrega, entre em contato com ADM')
      console.log(error)
    }
  }

  const updateDelivery = async () => {
    try {
      const data = { description, codCar, codDriver, codAssistant }

      const { data: dataDelivery } = await api.put(`deliverys/${selectDelivery.ID}`, data)
      
      dataDelivery['sales'] = selectDelivery.sales
      
      setDelivery(delivery.map( item => item.ID === selectDelivery.ID ? dataDelivery : item))
      
      setOpen(false)
    } catch (e) {
      console.log(e)
      alert('Entre em contato com Administrador')
    }
  }

  const setSalesInModal = async e => {
    e.preventDefault()

    const saleFound = createDevSales.find( sale => sale.ID_SALES === idSale )

    if(saleFound === undefined) {
      try {
        if (idSale !== ''){
          const response = await api.get(`sales/ID_SALES/${idSale}/null/false`)

          response.data !== '' ? setCreateDevSales([ ...createDevSales,  ...response.data]) : setErrorMsg('Venda não encontrada')
        } else {
          setErrorMsg('Preencha o campo Código da Venda')
        }
      } catch (e) {
        console.log(e.response)
 
        if (e.response.status === 400) {
          setErrorMsg('Requisição Incorreta (Verifique valor digitado)!')
        } else {
          setErrorMsg('Erro ao comunicar com servidor!')
        }
      }
    } else {
      setErrorMsg('Venda já lançada')
    }
    setIdSale('')
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

      <hr style={{ marginTop: '16px' }}/>

      { selectDelivery ? null
       :<div className={classes.divSearchSale}>
          <TextField
            id="idSales"
            label="Inserir venda"
            placeholder="Digite código da venda"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={idSale}
            variant="outlined"
            onChange={ e => {
              setErrorMsg('')
              setIdSale(parseInt(e.target.value))
            }}
          />
          <button onClick={e => setSalesInModal(e)}>Inserir</button>
        </div>
      }
      {errorMsg === '' ? null : <div className={classes.error}>{errorMsg}</div> }

      <TableSales 
        selectSales={selectDelivery ? selectDelivery.sales : createDevSales} 
        setSalesProd={setSalesProd}
        salesProd={salesProd}
        type={ selectDelivery ? 'update' : 'create' }
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