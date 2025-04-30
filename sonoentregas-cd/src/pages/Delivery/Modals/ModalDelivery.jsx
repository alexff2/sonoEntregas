import React, { useEffect, useState } from "react"
import { 
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  CircularProgress
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
      margin: '16px 0 8px 8px',
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
  formControlTypeSearch: {
    margin: '16px 8px 8px 0',
    minWidth: '160px',
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
  const [ date, setDate ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ codCar, setCodCar ] = useState(false)
  const [ codDriver, setCodDriver ] = useState(false)
  const [ codAssistant, setCodAssistant ] = useState(false)
  const [ codAssistant2, setCodAssistant2 ] = useState(false)
  const [ search, setSearch ] = useState('')
  const [ typeSearch, setTypeSearch ] = useState('idSale')
  const [ deliverySales, setDeliverySales ] = useState([])
  const [ availableStocks, setAvailableStocks ] = useState([])
  const [ errorMsg, setErrorMsg ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)

  const { cars, setCars } = useCars()
  const { drivers, setDrivers } = useDrivers()
  const { assistants, setAssistants } = useAssistants()
  const { setDelivery } = useDelivery()
  const { setForecasts } = useForecasts()
  const { setSales } = useSale()
  const { setAlert } = useAlert()
  const classes = useStyles()

  useEffect(() => {
    const searchUsers = async () => {
      if (assistants.length === 0) {
        const { data: usersResponse } = await api.get('users/0')
        const { data: carsResponse } = await api.get('cars')

        setCars(carsResponse)
        setDrivers(usersResponse.filter(user => user.OFFICE === 'Driver'))
        setAssistants(usersResponse.filter(user => user.OFFICE === 'Assistant'))
      }
    }

    searchUsers()
  }, [setCars, setDrivers, setAssistants, assistants])

  //Functions Other
  const createDelivery = async () => {
    try {
      if (!codCar || !codDriver || !codAssistant){
        setAlert('Preencha todos as informações')
        return
      }

      if(date === '') {
        setErrorMsg('Selecione a data de carregamento!')
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      let salesProd = []

      deliverySales.forEach( sale => {
        salesProd = [ ...salesProd,...sale.products]
      })

      await api.post('deliveries', {
        description: description,
        ID_CAR: codCar,
        ID_DRIVER: codDriver,
        ID_ASSISTANT: codAssistant,
        ID_ASSISTANT2: codAssistant2,
        D_MOUNTING: date,
        salesProd
      })

      const { data: dataDelivery } = await api.get('delivery/status') 
      setDelivery(dataDelivery)

      const { data: dataSales } = await api.get('sales/', {
        params: {
          status: 'open'
        }
      })

      setSales(dataSales)

      setOpen(false)
    } catch (e) {
      setIsLoading(false)
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
      setIsLoading(true)

      if(date === '' || description === '') {
        setErrorMsg('Selecione a data e a descrição da previsão!')
        setIsLoading(false)
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
        setIsLoading(false)
        return
      }

      const forecast = {
        date,
        description,
        sales
      }

      await api.post('forecast', forecast)

      const { data } = await api.get('forecast')

      setForecasts(data)

      setOpen(false)
    } catch (e) {
      setIsLoading(false)
      if (!e.response){
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 409){
        if (e.response.data.message === 'Product was out of stock!') {
          setErrorMsg('Atenção! Existe produtos que ficaram com estoque negativo, por favor verifique as vendas que estão com Qtd Disp negativo e de cor vermelha!')
        }
        if (e.response.data.message === 'Forecast date must be greater than the current date!') {
          setErrorMsg('A data de previsão deve ser superior a data atual!')
        }
        
        if (e.response.data.message === 'There is already a forecast for that date!') {
          setErrorMsg('Atenção!Já existe previsão criada com essa data!')
        }
        
      } else if (e.response.status === 400){
        console.log(e.response.data)
        setAlert('Servidor')
      } else {
        console.log(e.response.data)
      }
    }
  }

  const setStateSales = sales => {
    let products = []
      
    sales.forEach( sale => {
      products = [...products, ...sale.products]
    })

    setAvailableStocks([ ...availableStocks, ...products.filter( product => {
      const availableStock = availableStocks.find(availableStock => availableStock.COD_ORIGINAL === product.COD_ORIGINAL)

      if (!!availableStock) {
        return false
      }

      return true
    }).map(product => ({
      COD_ORIGINAL: product.COD_ORIGINAL,
      NOME: product.NOME,
      QUANTIDADE: product.QUANTIDADE,
      qtdFullForecast: product.qtdFullForecast,
      availableStock: product.availableStock
    }))])

    setDeliverySales([...deliverySales, ...sales])
  }

  const validationsSearchById = async (sales) => {
    if (sales.length > 1) {
      setSalesFound(sales)
      setOpenModalSelectSales(true)
      return
    }

    if (sales[0].validationStatus === null) {
      setErrorMsg('Venda não validada, solicite que a loja entre em contato com cliente!')
      setSearch('')
      return
    }

    if (sales[0].validationStatus === false) {
      setErrorMsg('A entrega desta venda foi recusada pelo cliente, acesse a previsão para ver o motivo!')
      setSearch('')
      return
    }

    setStateSales(sales)
  }

  const handleSearchSales = async e => {
    e.preventDefault()
    setIsLoading(true)

    if (search === ''){
      setErrorMsg(`Preencha o campo Código ${ typeSearch === 'codProduct' ? 'do Produto' : 'da DAV'}`)
      return
    }

    try {
      const { data }  = typeSearch === 'idSale'
        ? await api.get(`sales/${search}/${ type === 'forecast' ? 'forecast':'routes' }/create`)
        : await api.get(`/sales/forecast/create/product/${search}`)

      if (data === '') {
        setErrorMsg( typeSearch === 'idSale' ? 'Venda não enviada a base do CD!' : 'Produto sem vendas pendentes!')
  
        return
      }
  
      if (data.notFound) {
        setErrorMsg(data.notFound.message)
        
        return
      }
  
      if (data.length === 0) {
        setErrorMsg( typeSearch === 'idSale'
          ? 'Venda FECHADA já lançada em rota, consultar no menu VENDAS para saber STATUS da rota'
          : 'Atenção erro em venda(s) desse produto!'
        )

        return
      }

      if (data[0].isWithdrawal) {
        setErrorMsg('Venda para retirada, sem permissão para adicionar na previsão!')

        return
      }
  
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
        setErrorMsg('Venda(s) já lançada')
        return
      }

      typeSearch === 'idSale'
        ? validationsSearchById(filteredSales)
        : setStateSales(filteredSales)

      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
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

    setSearch('')
  }

  const onChangeInputSearch = e => {
    if (errorMsg !== '') {
      setErrorMsg('')
    }

    if (e.target.value === '') setSearch(e.target.value)
    else if (typeSearch === 'codProduct') setSearch(e.target.value)
    else if (!isNaN(parseInt(e.target.value))) setSearch(parseInt(e.target.value))
    else setErrorMsg('Digite apenas números')
  }

  const addSalesInDeliverySales = sale => {
    if (!sale.validationStatus) {
      setAvailableStocks([ ...availableStocks, ...sale.products.filter( product => {
        const availableStock = availableStocks.find(availableStock => availableStock.COD_ORIGINAL === product.COD_ORIGINAL)

        if (!!availableStock) {
          return false
        }

        return true
      }).map(product => ({
        COD_ORIGINAL: product.COD_ORIGINAL,
        NOME: product.NOME,
        QUANTIDADE: product.QUANTIDADE,
        qtdFullForecast: product.qtdFullForecast,
        availableStock: product.availableStock
      }))])

      setDeliverySales([...deliverySales, sale])
      setOpenModalSelectSales(false)
      setSearch('')
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
            style={{width: '40%'}}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            defaultValue={''}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            label="Data"
            type="date"
            variant="outlined"
            className={classes.formControl}
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
            <InputLabel id="assistantLabel">Auxiliar 1</InputLabel>
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
            <InputLabel id="assistantLabel">Auxiliar 2</InputLabel>
            <Select
              labelId="assistantLabel"
              label="Auxiliar"
              id="assistant"
              defaultValue={0}
              onChange={(e) => setCodAssistant2(e.target.value)}
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

        :<>
          <TextField
            id="date"
            label="Previsão"
            defaultValue={date}
            type="date"
            variant="outlined"
            onChange={e => setDate(e.target.value)}
            className={classes.fieldDate}
          /> &nbsp;

          <TextField
            id="description"
            label="Descrição"
            placeholder="Descrição da entrega"
            style={{width: '52%'}}
            variant="outlined"
            defaultValue={''}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </>
      }

      <hr style={{ marginTop: '16px' }}/>

      <div className={classes.divSearchSale}>
        <FormControl variant="outlined" className={classes.formControlTypeSearch}>
          <InputLabel id="typeSearch">Tipo</InputLabel>
          <Select
            labelId="typeSearch"
            value={typeSearch}
            onChange={e => {
              setErrorMsg('')
              setSearch('')
              setTypeSearch(e.target.value)
            }}
            label="Tipo da pesquisa"
          >
            <MenuItem value={'idSale'}>DAV</MenuItem>
            <MenuItem value={'codProduct'}>Produto</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="idSale"
          label={typeSearch === 'idSale' ? "Código DAV" : "Código Produto"}
          placeholder={typeSearch === 'idSale' ? "Digite código da DAV!" : "Digite código do produto!"}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={search}
          variant="outlined"
          onChange={onChangeInputSearch}
        />

        <button onClick={e => handleSearchSales(e)} disabled={isLoading}>
          { isLoading ?  <CircularProgress size={24} style={{ color: 'white'}}/> : 'Inserir' }
        </button>
      </div>

      {errorMsg !== '' && <div className={classes.error}>{errorMsg}</div> }

      <Box className={classes.sales}>
        <TableSales 
          sales={deliverySales} 
          setSales={setDeliverySales}
          type={type}
          availableStocks={availableStocks}
        />

        <Box className={classes.boxAddress}>
          <BoxInfo />
        </Box>
      </Box>

      <div className={classes.btnActions}>
        <ButtonSuccess 
          children={"Lançar"}
          onClick={type === 'forecast' ? createForecast : createDelivery }
          disabled={isLoading}
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
              className={!sale.validationStatus ? classes.card : classes.cardDisable}
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