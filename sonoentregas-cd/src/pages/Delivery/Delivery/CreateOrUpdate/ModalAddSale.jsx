import React, { useState } from 'react'
import {
  Paper,
  Box,
  Slide,
  TextField,
  Typography,
  Button,
  makeStyles,
  CircularProgress
} from '@material-ui/core/'

import Modal from '../../../../components/Modal'
import TableSales from '../../../../components/TableSales'
import BoxInfo from '../../../../components/BoxInfo'
import { ButtonCancel, ButtonSuccess } from '../../../../components/Buttons'

import { useAlert } from '../../../../context/alertContext'
import api from '../../../../services/api'
import { getDateBr } from '../../../../functions/getDates'

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

export default function ModalAddSale({ setOpen, idDelivery, setSales }){
  const [ openModalSelectSalesWithSameNumber, setOpenModalSelectSalesWithSameNumber ] = useState(false)
  const [ slideInputs, setSlideInputs ] = useState(true)
  const [ slideTable, setSlideTable ] = useState(false)
  const [ errorMsg, setErrorMsg ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const [ idSale, setIdSale ] = useState('')
  const [ saleSelected, setSaleSelected ] = useState([])
  const [ salesWithSameNumber, setSalesWithSameNumber ] = useState([])
  const [ availableStocks, setAvailableStocks ] = useState([])

  const { setAlert } = useAlert()
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
      setIsLoading(true)
      if (idSale === ''){
        setErrorMsg('Preencha o campo Código da Venda')
        setIsLoading(false)
        return
      }

      let { data }  = await api.get(`sales/${idSale}/routes/create`)

      if (data.length > 1) {
        setSalesWithSameNumber(data)
        setOpenModalSelectSalesWithSameNumber(true)
        setIsLoading(false)
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
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      if (!e.response) {
        console.log(e)
        setAlert('Rede')
      } else if (e.response.status === 500) {
        console.log(e.response)
        setAlert('Erro de servidor, entre em contato com Alexandre!')
      } else if (e.response.status === 404 || e.response.status === 409) {
        console.log(e.response)
        setErrorMsg(e.response.data.message)
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
      setIsLoading(true)

      await api.post(`/delivery/${idDelivery}/sales/add`, { sale: saleSelected[0] })

      const { data } = await api.get(`/delivery/${idDelivery}/sales/view`)

      setSales(data.sales)
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
        setAlert('Servidor')
      }
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      document.getElementById('idSale').focus()
    }, 100)
  }, [])

  return(
    <Box component={Paper} width={'1100px'} height="600px" p={4}>
      <Typography
        variant='h4'
        style={{ marginBottom: 12 }}
        component='h2'
      >
        Adicionar venda
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
              disabled={isLoading}
            >
              { isLoading ?  <CircularProgress size={24} style={{ color: 'white'}}/> : 'Inserir' }
            </Button>
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
              type={'delivery'}
              availableStocks={availableStocks}
            />

            <Box className={classes.boxAddress}>
              <BoxInfo />
            </Box>
          </Box>

          <div className={classes.btnActions}>
            <ButtonSuccess 
              children={"Lançar"}
              onClick={addSalesInData}
              disabled={isLoading}
              loading={isLoading}
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