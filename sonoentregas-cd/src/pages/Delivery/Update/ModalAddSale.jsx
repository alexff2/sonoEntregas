import React, { useState } from 'react'
import { useParams } from 'react-router'
import {
  Paper,
  Box,
  Slide,
  TextField,
  Typography,
  Button,
  makeStyles
} from '@material-ui/core/'

import Modal from '../../../components/Modal'
import TableSales from '../../../components/TableSales'
import BoxInfo from '../../../components/BoxInfo'
import { ButtonCancel, ButtonSuccess } from '../../../components/Buttons'

import { useAlert } from '../../../context/alertContext'
import { useForecasts } from '../../../context/forecastsContext'
import { useSale } from '../../../context/saleContext'
import { useDelivery } from '../../../context/deliveryContext'
import api from '../../../services/api'
import { getDateBr } from '../../../functions/getDates'

const useStyles = makeStyles(theme => ({
  btnAdd: {
    margin: '16px 0 8px 16px',
    width: 100,
    background: theme.palette.primary.main,
    border: 'none',
    borderRadius: 4,
    color: 'white',
    transition: '0.4s',
    '&:hover': {
      background: theme.palette.primary.main,
      opacity: '0.7'
    } 
  },
  boxAddress: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: 300
    },
  },
  btnActions: {
    width: '100%',
    padding: theme.spacing(2),
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

export default function ModalAddSale({ setOpen, typeModal }){
  const [ openModalSelectSalesWithSameNumber, setOpenModalSelectSalesWithSameNumber ] = useState(false)
  const [ slideInputs, setSlideInputs ] = useState(true)
  const [ slideTable, setSlideTable ] = useState(false)
  const [ errorMsg, setErrorMsg ] = useState('')
  const [ disabledBtnSave, setDisabledBtnSave ] = useState(false)
  const [ idSale, setIdSale ] = useState('')
  const [ whoWithdrew, setWhoWithdrew ] = useState('')
  const [ date, setDate ] = useState('')
  const [ saleSelected, setSaleSelected ] = useState([])
  const [ salesWithSameNumber, setSalesWithSameNumber ] = useState([])
  const [ availableStocks, setAvailableStocks ] = useState([])

  const { setAlert } = useAlert()
  const { setForecasts } = useForecasts()
  const { setDelivery } = useDelivery()
  const { setSales } = useSale()
  const { type, id } = useParams()
  const classes = useStyles()

  const onChangeInputIdSale = e => {
    if (errorMsg !== '') {
      setErrorMsg('')
    }

    if (e.target.value === '') setIdSale(e.target.value)
    else if (!isNaN(parseInt(e.target.value))) setIdSale(parseInt(e.target.value))
    else setErrorMsg('Digite apenas números')
  }

  const handleSearchSales = async () => {
    try {
      if (idSale === ''){
        setErrorMsg('Preencha o campo Código da Venda')
        return
      }

      let router

      if (typeModal === 'withdrawal') {
        router = 'forecast'
      } else {
        router = type === 'forecast' ? 'forecast':'routes'
      }

      let { data }  = await api.get(`sales/${idSale}/${router}/create`)

      if (typeModal === 'withdrawal') {
        if (!data[0].isWithdrawal) {
          setErrorMsg('Venda sem solicitação de retirada!')

          return
        }
      } else {
        if (data[0].isWithdrawal) {
          setErrorMsg('Venda para retirada, sem permissão para adicionar na previsão!')

          return
        }
      }

      if (data === '') {
        setErrorMsg('Venda não enviada a base do CD!')

        return
      } else if (data.notFound) {
        setErrorMsg(data.notFound.message)
        
        return
      } else if (data.length === 0) {
        setErrorMsg('Venda FECHADA já lançada em rota ou em previsão, consultar no menu VENDAS para saber STATUS')
        
        return
      } else {
        if (data.length > 1) {
          setSalesWithSameNumber(data)
          setOpenModalSelectSalesWithSameNumber(true)
          return
        }

        if (data[0].validationStatus === null) {
          setErrorMsg('Venda não validada, solicite que a loja entre em contato com cliente!')
          setIdSale('')
          return
        }

        if (data[0].validationStatus === false) {
          setErrorMsg('A entrega desta venda foi recusada pelo cliente, acesse a previsão para ver o motivo!')
          setIdSale('')
          return
        }

        setAvailableStocks([ ...availableStocks, ...data[0].products.filter( product => {
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

        setSaleSelected([...saleSelected, ...data])
        setSlideInputs(false)
        setSlideTable(true)
      }
    } catch (e) {
      if (!e.response) {
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 404) {
        console.log(e.response)
        setAlert('Not Found, entre em contato com Alexandre!')
      } else {
        console.log(e.response)
        setAlert('Servidor')
      }
    }
  }

  const addSaleFound = sale => {
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

      setSaleSelected([...saleSelected, sale])
      setSlideInputs(false)
      setSlideTable(true)
      setOpenModalSelectSalesWithSameNumber(false)
      setIdSale('')
    }
  }

  const addSalesInData = async () => {
    try {
      setDisabledBtnSave(true)

      let saleFiltered

      if (type === 'forecast') {
        saleFiltered = saleSelected.filter( sale => {
          sale.products = sale.products.filter( prod => prod.check)
  
          if (sale.products.length > 0) {
            return true
          }
  
          return false
        })
      } else {
        saleFiltered = saleSelected
      }

      if(saleFiltered.length === 0) {
        setErrorMsg('Selecione ao menos um produto das vendas inseridas!')
        setDisabledBtnSave(false)
        return
      }

      if (type === 'forecast') {
        await api.post(`/forecast/${id}/sales/add`, { sales: saleFiltered })

        const { data } = await api.get('forecast')

        setForecasts(data)
      } else {
        let salesProd = []

        saleFiltered.forEach(sale => {
          salesProd = [...salesProd, ...sale.products]
        })

        await api.post(`/delivery/${id}/sales/add`, { salesProd })

        const { data } = await api.get('deliverys/open')

        setDelivery(data)
      }

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
        if (e.response.data.message === 'outdated forecast!') {
          setAlert('Previsão fora do prazo!')
        } else setAlert(e.response.data)
      }
    }
  }

  const handleWithdrawal = async () => {
    try {
      if (date === '' || whoWithdrew === '') {
        setAlert('Selecione a data da retirada e quem retirou a mercadoria!')
        return
      }

      setDisabledBtnSave(true)

      let validation = true

      saleSelected[0].products.forEach( prod => {
        if(!prod.check){
          validation = false
        }
      })

      if (!validation) {
        setAlert('Selecione todos os produtos!')
        return
      }

      await api.post('delivery/withdrawal', {
        date,
        idSale: saleSelected[0].ID,
        whoWithdrew
      })

      const { data: dataDelivery } = await api.get('deliverys/status') 
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
        if (e.response.data.message === 'outdated forecast!') {
          setAlert('Previsão fora do prazo!')
        } else setAlert(e.response.data)
      }
    }
  }

  return(
    <Box component={Paper} width={'1100px'} height="600px" p={4}>
      <Typography
        variant='h4'
        style={{ marginBottom: 12 }}
        component='h2'
      >
        {typeModal === 'withdrawal' ? 'Registrar retirada de venda' : 'Adicionar venda'}
      </Typography>

      <Slide direction="right" in={slideInputs} mountOnEnter unmountOnExit>
        <Paper>
          <Box p={4} display='flex'>
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
              onKeyPress={e => e.key === 'Enter' && handleSearchSales()}
            />
            <Button
              className={classes.btnAdd}
              onClick={handleSearchSales}
            >Inserir</Button>
          </Box>

          { errorMsg !== '' && <Box 
              bgcolor='#e57373'
              color={'white'}
              fontWeight='bold'
              p={1}
            >
              {errorMsg}
              </Box>}

          <Modal
            open={openModalSelectSalesWithSameNumber}
            setOpen={setOpenModalSelectSalesWithSameNumber}
          >
            <Box p={4}>
              <Typography>
                Exite mais de uma venda com a numeração
                <strong style={{color: 'red'}}> {salesWithSameNumber[0]?.ID_SALES}</strong>, 
                selecione apenas uma abaixo!
              </Typography>
              {salesWithSameNumber.map((sale, i) => (
                <Paper
                  key={i}
                  className={!sale.validationStatus ? classes.card : classes.cardDisable}
                  onClick={() => addSaleFound(sale)}>
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
        </Paper>
      </Slide>

      <Slide direction="left" in={slideTable} mountOnEnter unmountOnExit>
        <Paper style={{padding: 8}}>
          {typeModal === 'withdrawal' &&
            <Box display={'flex'}>
              <TextField
                label="Quem retirou"
                type="text"
                variant="outlined"
                className={classes.formControl}
                style={{ width: 300, marginLeft: 8}}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setWhoWithdrew(e.target.value)}
              />
              <TextField
                label="Data"
                type="date"
                variant="outlined"
                className={classes.formControl}
                style={{ width: 171, marginLeft: 8}}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setDate(e.target.value)}
              />
            </Box>
          }
          {errorMsg !== '' && 
            <Box 
              bgcolor='#e57373'
              color={'white'}
              fontWeight='bold'
              p={1}
            >
              {errorMsg}
            </Box>
          }
          <Box display="flex" mt={2}>
            <TableSales 
              sales={saleSelected} 
              setSales={setSaleSelected}
              type={typeModal === 'withdrawal' ? 'forecast' : type}
              availableStocks={availableStocks}
            />

            <Box className={classes.boxAddress}>
              <BoxInfo />
            </Box>
          </Box>

          <div className={classes.btnActions}>
            <ButtonSuccess 
              children={"Lançar"}
              onClick={typeModal === 'withdrawal' ? handleWithdrawal : addSalesInData}
              disabled={disabledBtnSave}
              loading={disabledBtnSave}
            />
            <ButtonCancel 
              children="Cancelar"
              onClick={() => setOpen(false)}
              className={classes.btnCancel}
            />
          </div>
        </Paper>
      </Slide>
    </Box>
  )
}