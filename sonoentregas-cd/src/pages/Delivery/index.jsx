import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import ModalView from './Modals/ModalView'
import ModalDelivering from './Delivery/ModalDelivering'
import FinishModal from './Delivery/FinishModal'
import TableDelivery from './Delivery/TableDelivery'
import TableForecast from './Forecast/TableForecast'
import Withdrawal from './Withdrawal'
//Context
import { useDelivery } from '../../context/deliveryContext'
import { useDeliveryFinish } from '../../context/deliveryFinishContext'
import { useForecasts } from '../../context/forecastsContext'
import { useAlert } from '../../context/alertContext'
import { useBackdrop } from '../../context/backdropContext'

import { getDateSql, getObjDate } from '../../functions/getDates'
import api from '../../services/api'

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
  const [ openModalWithdrawal, setOpenModalWithdrawal ] = useState(false)
  const [ openModalDelivering, setOpenModalDelivering ] = useState(false)
  const [ openFinish, setOpenFinish ] = useState(false)
  const [ openView, setOpenView ] = useState(false)
  const [ forecastsFinish, setForecastsFinish ] = useState([])

  //States
  const [ selectDelivery, setSelectDelivery ] = useState({})

  const navigate = useNavigate()
  const { setDelivery } = useDelivery()
  const { setDeliveryFinish } = useDeliveryFinish()
  const { forecasts, setForecasts } = useForecasts()
  const { setAlert } = useAlert()
  const { setOpenBackDrop } = useBackdrop()

  const classes = useStyle()

  useEffect(() => {
    const updateSys = async () => {
      setOpenBackDrop(true)
      try {
        const { data: dataDeliveries } = await api.get('delivery/open')
        const { data: dataDeliveriesFinished } = await api.get(`delivery/close/${getDateSql()}`)
        const { data: dataForecasts } = await api.get('forecast/open')
  
        setDelivery(dataDeliveries)
        setDeliveryFinish(dataDeliveriesFinished)
        setForecasts(dataForecasts)

        setOpenBackDrop(false)
      } catch (error) {
        setOpenBackDrop(false)
        setAlert('Erro ao atualizar sistema, entre em contato com ADM!')
        console.log(error)
      }
    }

    updateSys()
  }, [
    setForecasts,
    setDelivery,
    setAlert,
    setDeliveryFinish,
    setOpenBackDrop
  ])

  const forecastsAvailable = forecasts.filter(forecast => forecast.status)

  //Functions
  const deleteDelivery = async cod => {
    try {
      await api.delete(`delivery/${cod}`)

      const { data: dataDeliv } = await api.get('delivery/open') 
      setDelivery(dataDeliv)
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
      case 'withdrawal':
        setOpenModalSelect(false)
        setOpenModalWithdrawal(true)
        break;
      case 'view':
        setSelectDelivery(item)
        setOpenView(true)
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
      const { data } = await api.get(`forecast/finished`, {
        params: {
          date: e.target.value,
        }
      })

      setForecastsFinish(data)
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

        <TableForecast forecastsFinish={forecastsFinish}/>

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
          <Paper className={classes.card}  onClick={() => navigate('/app/forecast/create/0')}>
            <Box>
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.text}
              >Previsão</Typography>
            </Box>
          </Paper>
          {forecastsAvailable.length > 0 &&
            <Paper className={classes.card}  onClick={() => navigate('/app/delivery/create')}>
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
        open={openModalWithdrawal}
        setOpen={setOpenModalWithdrawal}
      >
        <Withdrawal setOpen={setOpenModalWithdrawal} typeModal='withdrawal'/>
      </Modal>

      <Modal
        open={openFinish}
        setOpen={setOpenFinish}
        title={"Finalizar Entrega"}
      >
        <FinishModal
          id={selectDelivery.ID} 
          setOpen={setOpenFinish}
        />
      </Modal>

      <Modal
        open={openView}
        setOpen={setOpenView}
        title={"Visualização"}
      >
        <ModalView
          id={selectDelivery.ID} 
          setOpen={setOpenView}
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
