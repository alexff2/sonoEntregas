import React, { useState, useEffect } from 'react'
import {
  Box,
  Fab,
  fade,
  makeStyles,
  Paper,
  TextField,
  Typography
} from '@material-ui/core'
import { Add } from '@material-ui/icons'

//Components
import Modal from '../../components/Modal'
import ModalDelivery from './Modals/ModalDelivery'
import ModalView from './Modals/ModalView'
import ModalDelivering from './Modals/ModalDelivering'
import TableDelivery from './Tables/TableDelivery'
import TableForecast from './Tables/TableForecast'
import ModalAddSale from './Update/ModalAddSale'
//Context
import { useDelivery } from '../../context/deliveryContext'
import { useDeliveryFinish } from '../../context/deliveryFinishContext'
import { useForecasts } from '../../context/forecastsContext'
import { useSale } from '../../context/saleContext'
import { useAlert } from '../../context/alertContext'

import { getDateSql, getObjDate } from '../../functions/getDates'
import api from '../../services/api'
import LoadingCircleModal from '../../components/LoadingCircleModal'

const useStyle = makeStyles(theme => ({
  btnAdd: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem'
  },
  fieldSeach: {
    color: fade(theme.palette.common.white, 0.55),
    height: '2rem',
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
  label: {
    color: fade(theme.palette.common.white, 0.55)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  boxTabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    '& span': {
      fontSize: 20,
      fontWeight: theme.typography.fontWeightBold
    },
    '& div': {
      fontSize: 15,
      fontWeight: theme.typography.fontWeightBold,
      '& input': {
        border: 'none'
      }
    }
  },
  card: {
    height: '100%',
    width: '100%',
    padding: 40,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: '0px 3.21306px 5.3551px rgba(0, 0, 0, 0.2), 0px 1.07102px 19.2783px rgba(0, 0, 0, 0.12), 0px 6.42612px 10.7102px rgba(0, 0, 0, 0.14)',
      cursor: 'pointer',
      '& $text': {
        color: 'white'
      }
    }
  },
  text: {}
}))

export default function Delivery() {
  //Modals Open States
  const [ openModalSelect, setOpenModalSelect ] = useState(false)
  const [ openModalCreateForecastDelivery, setOpenModalCreateForecastDelivery ] = useState(false)
  const [ openModalWithdrawal, setOpenModalWithdrawal ] = useState(false)
  const [ openModalDelivering, setOpenModalDelivering ] = useState(false)
  const [ openFinish, setOpenFinish ] = useState(false)
  const [ openView, setOpenView ] = useState(false)
  const [ openLoading, setOpenLoading ] = useState(false)

  //States
  const [ selectDelivery, setSelectDelivery ] = useState({})
  const [ typeForecasDelivery, setTypeForecasDelivery ] = useState('')

  const { setDelivery } = useDelivery()
  const { setDeliveryFinish } = useDeliveryFinish()
  const { forecasts, setForecasts } = useForecasts()
  const { setSales } = useSale()
  const { setAlert } = useAlert()

  const classes = useStyle()

  useEffect(() => {
    const updateSys = async () => {
      setOpenLoading(true)
      try {
        const { data: dataDeliveries } = await api.get('delivery/open')
        const { data: dataDeliveriesFinished } = await api.get(`delivery/close/${getDateSql()}`)
        const { data: dataForecasts } = await api.get('forecast')
  
        setDelivery(dataDeliveries)
        setDeliveryFinish(dataDeliveriesFinished)
        setForecasts(dataForecasts)

        setOpenLoading(false)
      } catch (error) {
        setOpenLoading(false)
        setAlert('Erro ao atualizar sistema, entre em contato com ADM!')
        console.log(error)
      }
    }

    updateSys()
  }, [
    setForecasts,
    setDelivery,
    setAlert,
    setDeliveryFinish
  ])

  const checkDataForecast = (date) => {
    const timezoneForecast = getObjDate(date).setHours(0,0,0,0)
    const timezoneNow = new Date().setHours(0,0,0,0)

    return timezoneForecast < timezoneNow
  }

  const forecastsAvailable = forecasts.filter( forecast => forecast.status && !checkDataForecast(forecast.date) )

  //Functions
  const deleteDelivery = async cod => {
    try {
      const { data } = await api.delete(`delivery/${cod}`)

      const { data: dataDeliv } = await api.get('delivery/status/') 
      setDelivery(dataDeliv)

      if (data.delete) {
        const { data: dataSales } = await api.get('sales/', {
          params: {
            status: 'open'
          }
        })
        setSales(dataSales)
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
  }

  const openModals = (item, modal) => {
    switch (modal) {
      case 'create':
        setOpenModalSelect(false)
        setOpenModalCreateForecastDelivery(true)
        setTypeForecasDelivery(item)
        break;
      case 'withdrawal':
        setOpenModalSelect(false)
        setOpenModalWithdrawal(true)
        break;
      case 'view':
        setSelectDelivery(item)
        setOpenView(true)
        break;
      case 'finish':
        setSelectDelivery(item)
        setOpenFinish(true)
        break;
      case 'status':
        if (item.STATUS === 'Em lançamento') {
          setOpenModalDelivering(true)
          setSelectDelivery(item)
        } else if (item.STATUS === 'Entregando') {
          setOpenFinish(true)
          setSelectDelivery(item)
        }
        break
      default:
        break
    }
    
  }

  const searchDeliveryFinished = async e => {
    try {
      const { data } = await api.get(`delivery/close/${e.target.value}`)
      setDeliveryFinish(data)
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

  const searchForecastFinished = async e => {
    try {
      const { data } = await api.get(`forecast/closed`, {
        params: {
          typeSearch: 'date',
          search: e.target.value,
        }
      })

      setDeliveryFinish(data)
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

  return (
    <>
      <LoadingCircleModal open={openLoading} />

      <Box>
        <div className={classes.boxTabHeader} style={{paddingTop: '1rem'}}>
          <span>Previsões</span>
          <div>
            <TextField
              id="date"
              label="Dia"
              type="date"
              onChange={searchForecastFinished}
              className={classes.fieldDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>

        <TableForecast />

        <div className={classes.boxTabHeader} style={{paddingTop: '1rem'}}>
          <span>Rotas em processo</span>
        </div>

        <TableDelivery
          type="open"
          deleteDelivery={deleteDelivery}
          openModals={openModals}
        />

        <div className={classes.boxTabHeader} style={{paddingTop: '1rem'}}>
          <span>Rotas Finalizadas</span>
          <div>
            <TextField
              id="date"
              label="Dia"
              type="date"
              onChange={searchDeliveryFinished}
              className={classes.fieldDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>

        <TableDelivery
          type="close"
          openModals={openModals}
        />

        <Fab 
          color="primary"
          className={classes.btnAdd}
          onClick={() => setOpenModalSelect(true)}
        >
          <Add />
        </Fab>
      </Box>
      
      {/* Modais*/}
      <Modal
        open={openModalSelect}
        setOpen={setOpenModalSelect}
        title={"Selecione:"}
      >
        <Box display="flex" flexDirection="row">
          <Paper className={classes.card}  onClick={() => openModals('', 'withdrawal')}>
            <Box>
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.text}
              >Retirada</Typography>
            </Box>
          </Paper>
          <Paper className={classes.card}  onClick={() => openModals('forecast', 'create')}>
            <Box>
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.text}
              >Previsão</Typography>
            </Box>
          </Paper>
          {forecastsAvailable.length > 0 &&
            <Paper className={classes.card}  onClick={() => openModals('delivery', 'create')}>
              <Box>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  className={classes.text}
                >Entrega</Typography>
              </Box>
            </Paper>
          }
        </Box>
      </Modal>

      <Modal 
        open={openModalCreateForecastDelivery}
        setOpen={setOpenModalCreateForecastDelivery}
        title={typeForecasDelivery === 'forecast' ? 'Lançar Previsão' : 'Carregar caminhão'}
      >
        <ModalDelivery
          setOpen={setOpenModalCreateForecastDelivery}
          type={typeForecasDelivery}
        />
      </Modal>

      <Modal
        open={openModalWithdrawal}
        setOpen={setOpenModalWithdrawal}
      >
        <ModalAddSale setOpen={setOpenModalWithdrawal} typeModal='withdrawal'/>
      </Modal>

      <Modal
        open={openFinish}
        setOpen={setOpenFinish}
        title={"Finalizar Entrega"}
      >
        <ModalView 
          setOpen={setOpenFinish}
          selectDelivery={selectDelivery}
          type={'open'}
        />
      </Modal>

      <Modal
        open={openView}
        setOpen={setOpenView}
        title={"Visualização"}
      >
        <ModalView 
          setOpen={setOpenView}
          selectDelivery={selectDelivery}
          type={'close'}
        />
      </Modal>

      <Modal
        open={openModalDelivering}
        setOpen={setOpenModalDelivering}
        title={"Iniciar deslocamento do caminhão"}
      >
        <ModalDelivering
          setOpen={setOpenModalDelivering}
          selectDelivery={selectDelivery}
        />
      </Modal>
    </>
  )
}
