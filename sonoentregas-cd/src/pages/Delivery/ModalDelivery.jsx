import React, { useEffect, useState } from "react"
import { 
  TextField,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox
} from "@material-ui/core"

//Components
import TableSales from '../../components/TableSales'
import BoxInfo from '../../components/BoxInfo'
import { ButtonCancel, ButtonSucess } from '../../components/Buttons'

//context
import { useCars } from '../../context/carsContext'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'
import { useDelivery } from '../../context/deliveryContext'
import { useSale } from '../../context/saleContext'
import { useAlert } from '../../context/alertContext'

import api from '../../services/api'
import { getDateBr } from '../../functions/getDates'

const useStyles = makeStyles(theme => ({
  //Style form select
  form: {
    position: 'relative',
    maxWidth: 1050
  },
  checkedPred: {
    position: "absolute",
    top: -50,
    right: 0,
    fontWeight: theme.typography.fontWeightBold
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
  }
}))

export default function ModalDelivery({ setOpen, selectDelivery }){
  //States
  const [ checkedPred, setCheckedPred ] = useState(false)
  const [ disableDrive, setDisableDrive ] = useState(false)
  const [ disableAssist, setDisableAssist ] = useState(false)
  const [ disableCar, setDisableCar ] = useState(false)
  const [ datePrev, setDatePrev ] = useState()
  const [ description, setDescription ] = useState('')
  const [ codCar, setCodCar ] = useState(false)
  const [ codDriver, setCodDriver ] = useState(false)
  const [ codAssistant, setCodAssistant ] = useState(false)
  const [ idSale, setIdSale ] = useState('')
  const [ createDevSales, setCreateDevSales ] = useState([])
  const [ salesProd, setSalesProd ] = useState([])
  const [ errorMsg, setErrorMsg ] = useState('')
  const [ disabledBtnGrav, setDisabledBtnGrav ] = useState(false)

  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const { setDelivery } = useDelivery()
  const { setSales } = useSale()
  const { setAlert } = useAlert()

  //Styes
  const classes = useStyles()

  //Start component
  useEffect(() => {
    if (selectDelivery){
      setDescription(selectDelivery.DESCRIPTION)
      setCodCar(selectDelivery.ID_CAR)
      setCodDriver(selectDelivery.ID_DRIVER)
      setCodAssistant(selectDelivery.ID_ASSISTANT)
      setCreateDevSales(selectDelivery.sales)
      var salesProdTemp = []
      selectDelivery.sales.forEach(sale => {
        sale.products.forEach(product => {
          product['qtdDeliv'] = product.QTD_DELIV
          product['checked'] = true
          salesProdTemp.push(product)
        })
      })
      setSalesProd(salesProdTemp)
    }
  }, [selectDelivery])

  //Functions Outher
  const createDelivery = async () => {
    try {
      if (!codCar || !codDriver || !codAssistant){
        setAlert('Preencha todos as informações')
      } else {

        if (typeof codCar === 'boolean' && !datePrev) {
          return setAlert('Selecione uma data válida')
        }

        setDisabledBtnGrav(true)
        const data = {
          description: typeof codCar === 'boolean' ? `Previsão de ${getDateBr(datePrev)}`: description,
          codCar: typeof codCar === 'boolean' ? 0: codCar,
          codDriver: typeof codDriver === 'boolean' ? 0: codDriver,
          codAssistant: typeof codAssistant === 'boolean' ? 0: codAssistant,
          salesProd,
          status: 'Em lançamento'
        }

        const { data: dataDelivery } = await api.post('deliverys', data)

        const { data: dataDeliv } = await api.get('deliverys/status/') 
        setDelivery(dataDeliv)

        if (dataDelivery.ID) { //Tenta melhorar performace
          const { data: dataSales } = await api.get('sales/false/false/Aberta/null')

          setSales(dataSales)
        }

        setOpen(false)
      }
    } catch (e) {
      console.log(e.response)
      if (!e.response)
        setAlert('Rede')
      else if (e.response.status === 400)
        setAlert('Servidor')
      else
        setAlert(e.response.data)
    }
  }

  const updateDelivery = async () => {
    try {
      setDisabledBtnGrav(true)

      const dataDelivery = { description, codCar, codDriver, codAssistant, salesProd }

      const { data } = await api.put(`deliverys/${selectDelivery.ID}`, dataDelivery)

      const { data: dataDeliv } = await api.get('deliverys/status/') 
      setDelivery(dataDeliv)

      if (data.ID) { //Melhorar performace
        const { data: dataSales } = await api.get('sales/false/false/Aberta/null')
  
        setSales(dataSales)
      }

      setOpen(false)
    } catch (e) {
      console.log(e)
      setAlert('Entre em contato com Administrador')
    }
  }

  const setSalesInModal = async e => {
    e.preventDefault()

    const saleFound = createDevSales.find( sale => sale.ID_SALES === idSale )

    if(!saleFound) {
      try {
        if (idSale !== ''){
          const {data} = await api.get(`sales/ID_SALES/${idSale}/null/false`)

          if(data !== '' ) {
            let sales = []

            sales = data.filter(sale => sale.STATUS === 'Aberta')

            setCreateDevSales([...createDevSales, ...sales])

            sales.length === 0 && 
              setErrorMsg('Venda FECHADA já lançada em rota, consultar no menu VENDAS para saber STATUS da rota')
          } else 
            setErrorMsg('Venda não encontrada')
        } else {
          setErrorMsg('Preencha o campo Código da Venda')
        }
      } catch (e) {
        console.log(e)
 
        if (e.response && e.response.status === 400) {
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

  const handleChekedPrevision = e => {
    setCheckedPred(!checkedPred)
    setDisableDrive(!disableDrive)
    setDisableAssist(!disableAssist)
    setDisableCar(!disableCar)

    setCodDriver(!codDriver)
    setCodAssistant(!codAssistant)
    setCodCar(!codCar)
  }

  //Component
  return(
    <form className={classes.form}>
      {!selectDelivery &&
        <FormControlLabel
        className={classes.checkedPred}
        control={
          <Checkbox
          checked={checkedPred}
          onChange={handleChekedPrevision}
          name="predction"
          />
        }
        labelPlacement="start"
        label="PREVISÃO"
      />}

      {!checkedPred
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
            defaultValue={selectDelivery ? selectDelivery.DESCRIPTION : ''}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="driverLabel">Motorista</InputLabel>
            <Select
              labelId="driverLabel"
              label="Motorista"
              id="driver"
              defaultValue={selectDelivery ? selectDelivery.ID_DRIVER : 0}
              onChange={(e) => setCodDriver(e.target.value)}
              disabled={disableDrive}
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
              disabled={disableAssist}
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
              disabled={disableCar}
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
          type="date"
          onChange={e => setDatePrev(e.target.value)}
          className={classes.fieldDate}
          InputLabelProps={{
            shrink: true,
          }}
        />
      }

      <hr style={{ marginTop: '16px' }}/>

      <div className={classes.divSearchSale}>
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

      {errorMsg === '' ? null : <div className={classes.error}>{errorMsg}</div> }

      <Box className={classes.sales}>
        <TableSales 
          selectSales={createDevSales} 
          setSalesProd={setSalesProd}
          salesProd={salesProd}
          type={ selectDelivery ? 'update' : 'create' }
        />

        <Box className={classes.boxAddress}>
          <BoxInfo />
        </Box>
      </Box>

      <div className={classes.btnActions}>
        <ButtonSucess 
          children={selectDelivery ? "Editar" : "Lançar"}
          className={classes.btnSucess}
          onClick={selectDelivery ? updateDelivery : createDelivery}
          disabled={disabledBtnGrav}
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