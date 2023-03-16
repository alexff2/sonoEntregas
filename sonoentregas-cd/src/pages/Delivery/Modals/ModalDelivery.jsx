import React, { useState } from "react"
import { 
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper
} from "@material-ui/core"

//Components
import Modal from '../../../components/Modal'
import TableSales from '../../../components/TableSales'
import BoxInfo from '../../../components/BoxInfo'
import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'

//context
import { useCars } from '../../../context/carsContext'
import { useDrivers } from '../../../context/driverContext'
import { useAssistants } from '../../../context/assistantContext'
import { useDelivery } from '../../../context/deliveryContext'
import { useForecasts } from '../../../context/forecastsContext'
import { useSale } from '../../../context/saleContext'
import { useAlert } from '../../../context/alertContext'

import api from '../../../services/api'
import { getDateBr } from '../../../functions/getDates'

const useStyles = makeStyles(theme => ({
  //Style form select
  form: {
    position: 'relative',
    maxWidth: 1050
  },
  fieldDate: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  divFormControl: {
    display: 'flex',
    alignItems: 'center'
  },
  formControl: {
    width: '15%',
    marginLeft: '1%'
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
  sales: {
    marginTop: theme.spacing(1),
    display: 'flex'
  },
  boxAddress: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: 300
    },
  },
  //Style buttons
  btnActions: {
    width: '100%',
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  card: {
    height: '100%',
    width: '100%',
    padding: 12,
    marginTop: 16,
    marginBottom: 12,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0px 3px 5px rgba(0, 0, 0, 0.2), 
      0px 1px 19px rgba(0, 0, 0, 0.12), 
      0px 6px 10px rgba(0, 0, 0, 0.14)`,
      cursor: 'pointer',
      '& $text': {
        color: 'white'
      }
    }
  },
  text: {},
  cardDisable: {
    height: '100%',
    width: '100%',
    padding: 12,
    marginTop: 16,
    marginBottom: 12
  }
}))

export default function ModalDelivery({ setOpen, type }){
  //States
  const [ openModalSelectSales, setOpenModalSelectSales ] = useState(false)
  const [ salesFound, setSalesFound ] = useState([])
  const [ dateForecast, setDateForecast ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ codCar, setCodCar ] = useState(false)
  const [ codDriver, setCodDriver ] = useState(false)
  const [ codAssistant, setCodAssistant ] = useState(false)
  const [ idSale, setIdSale ] = useState('')
  const [ deliverySales, setDeliverySales ] = useState([])
  const [ errorMsg, setErrorMsg ] = useState('')
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)

  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { setDelivery } = useDelivery()
  const { setForecasts } = useForecasts()
  const { setSales } = useSale()
  const { setAlert } = useAlert()

  //Styes
  const classes = useStyles()

  //Functions Other
  const createDelivery = async () => {
    try {
      if (!codCar || !codDriver || !codAssistant){
        setAlert('Preencha todos as informações')
        return
      }

      setDisabledBtnSave(true)

      let salesProd = []

      deliverySales.forEach( sale => {
        salesProd = [ ...salesProd,...sale.products]
      })

      await api.post('deliverys', {
        description: description,
        ID_CAR: codCar,
        ID_DRIVER: codDriver,
        ID_ASSISTANT: codAssistant,
        salesProd
      })

      const { data: dataDelivery } = await api.get('deliverys/status/') 
      setDelivery(dataDelivery)

      const { data: dataSales } = await api.get('sales/', {
        params: {
          status: 'open'
        }
      })

      setSales(dataSales)

      setOpen(false)
    } catch (e) {
      if (!e.response){
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)
        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
  }

  const createForecast = async () => {
    try {
      setDisabledBtnSave(true)

      if(dateForecast === '') {
        setErrorMsg('Selecione a data de previsão!')
        setDisabledBtnSave(false)
        return
      }

      const sales = deliverySales.filter( sale => {
        sale.products = sale.products.filter( prod => prod.check)

        if (sale.products.length > 0) {
          return true
        }

        return false
      })

      if(sales.length === 0) {
        setErrorMsg('Selecione ao menos um produto das vendas inseridas!')
        setDisabledBtnSave(false)
        return
      }

      const forecast = {
        dateForecast,
        sales
      }

      await api.post('forecast', forecast)

      const { data } = await api.get('forecast')

      setForecasts(data)

      const { data: dataSales } = await api.get('sales/', {
        params: {
          status: 'open'
        }
      })

      setSales(dataSales)

      setOpen(false)
    } catch (e) {
      if (!e.response){
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)
        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
  }

  const handleSearchSales = async e => {
    try {
      e.preventDefault()

      if (idSale === ''){
        setErrorMsg('Preencha o campo Código da Venda')
        return
      }

      let { data }  = await api.get(`sales/${idSale}/${ type === 'forecast' ? 'forecast':'routes' }/create`)

      if (data === '') {
        setErrorMsg('Venda não enviada a base do CD!')

        return
      } else if (data.notFound) {
        setErrorMsg(data.notFound.message)
        
        return
      } else if (data.length === 0) {
        setErrorMsg('Venda FECHADA já lançada em rota, consultar no menu VENDAS para saber STATUS da rota')
        
        return
      } else {
        const filteredSales = deliverySales.length > 0
          ? data.filter( sale => {
              const deliverySale = deliverySales.find( deliverySale => deliverySale.ID === sale.ID)

              if (!!deliverySale) {
                return false
              }

              return true
            })
          : data

        if(filteredSales.length === 0) {
          setErrorMsg('Venda já lançada')
          return
        }

        if (filteredSales.length > 1) {
          setSalesFound(filteredSales)
          setOpenModalSelectSales(true)
          return
        }

        if (filteredSales[0].validationStatus === null) {
          setErrorMsg('Venda não validada, solicite que a loja entre em contato com cliente!')
          setIdSale('')
          return
        }

        if (filteredSales[0].validationStatus === false) {
          setErrorMsg('A entrega desta venda foi recusada pelo cliente, acesse a previsão para ver o motivo!')
          setIdSale('')
          return
        }

        setDeliverySales([...deliverySales, ...filteredSales])
      }
    } catch (e) {
      if (!e.response){
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 400){
        console.log(e.response.data)
        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
    setIdSale('')
  }

  const onChangeInputIdSale = e => {
    if (errorMsg !== '') {
      setErrorMsg('')
    }

    if (e.target.value === '') setIdSale(e.target.value)
    else if (!isNaN(parseInt(e.target.value))) setIdSale(parseInt(e.target.value))
    else setErrorMsg('Digite apenas números')
  }

  const addSalesInDeliverySales = sale => {
    if (sale.validationStatus) {
      setDeliverySales([...deliverySales, sale])
      setOpenModalSelectSales(false)
      setIdSale('')
    }
  }

  //Component
  return(
    <form className={classes.form}>

      {type !== 'forecast'
        ?<div className={classes.divFormControl}>
          <TextField
            id="description"
            label="Descrição"
            placeholder="Descrição da entrega"
            style={{width: '52%'}}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            defaultValue={''}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="driverLabel">Motorista</InputLabel>
            <Select
              labelId="driverLabel"
              label="Motorista"
              id="driver"
              defaultValue={0}
              onChange={(e) => setCodDriver(e.target.value)}
              disabled={type === 'forecast' ? true : false}
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
              defaultValue={0}
              onChange={(e) => setCodAssistant(e.target.value)}
              disabled={type === 'forecast' ? true : false}
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
              defaultValue={0}
              onChange={(e) => setCodCar(e.target.value)}
              disabled={type === 'forecast' ? true : false}
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

        :<TextField
          id="date"
          label="Previsão"
          defaultValue={dateForecast}
          type="date"
          onChange={e => setDateForecast(e.target.value)}
          className={classes.fieldDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      }

      <hr style={{ marginTop: '16px' }}/>

      <div className={classes.divSearchSale}>
        <TextField
          id="idSale"
          label="Inserir venda"
          placeholder="Digite código da venda"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={idSale}
          variant="outlined"
          onChange={onChangeInputIdSale}
        />
        <button onClick={e => handleSearchSales(e)}>Inserir</button>
      </div>

      {errorMsg !== '' && <div className={classes.error}>{errorMsg}</div> }

      <Box className={classes.sales}>
        <TableSales 
          sales={deliverySales} 
          setSales={setDeliverySales}
          type={type}
        />

        <Box className={classes.boxAddress}>
          <BoxInfo />
        </Box>
      </Box>

      <div className={classes.btnActions}>
        <ButtonSuccess 
          children={"Lançar"}
          onClick={type === 'forecast' ? createForecast : createDelivery }
          disabled={disabledBtnSave}
        />
        <ButtonCancel 
          children="Cancelar"
          onClick={() => setOpen(false)}
          className={classes.btnCancel}
        />
      </div>

      <Modal
        open={openModalSelectSales}
        setOpen={setOpenModalSelectSales}
      >
        <Box p={4}>
          <Typography>
            Exite mais de uma venda com a numeração
            <strong style={{color: 'red'}}> {salesFound[0]?.ID_SALES}</strong>, 
            selecione apenas uma abaixo!
          </Typography>
          {salesFound.map((sale, i) => (
            <Paper
              key={i}
              className={sale.validationStatus ? classes.card : classes.cardDisable}
              onClick={() => addSalesInDeliverySales(sale)}>
              <Box>
                <Typography className={classes.text}>
                  Cliente: {sale.NOMECLI}
                </Typography>
                <Typography className={classes.text}>
                  Loja: {sale.SHOP}
                </Typography>
                {sale.date && <Typography className={classes.text}>
                  Previsão de {getDateBr(sale.date)}
                </Typography>}
              </Box>
              { sale.validationStatus === null && <Typography color='secondary'>Ainda não validada!</Typography>}
              { sale.validationStatus === false && <Typography color='secondary'>Recusada pelo cliente!</Typography>}
            </Paper>
          ))}
        </Box>
      </Modal>
    </form>
  )
}