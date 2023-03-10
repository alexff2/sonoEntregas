import React, { useState } from 'react'
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
//Context
import { useDelivery } from '../../context/deliveryContext'
import { useDeliveryFinish } from '../../context/deliveryFinishContext'
import { useForecasts } from '../../context/forecastsContext'
import { useSale } from '../../context/saleContext'
import { useAlert } from '../../context/alertContext'

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
  const [ openModalSelectForecastDelivery, setOpenModalSelectForecastDelivery ] = useState(false)
  const [ openModalCreateForecastDelivery, setOpenModalCreateForecastDelivery ] = useState(false)
  const [ openModalDelivering, setOpenModalDelivering ] = useState(false)
  const [ openFinish, setOpenFinish ] = useState(false)
  const [ openView, setOpenView ] = useState(false)

  //States
  const [ selectDelivery, setSelectDelivery ] = useState({})
  const [ typeForecasDelivery, setTypeForecasDelivery ] = useState('')

  const { setDelivery } = useDelivery()
  const { setDeliveryFinish } = useDeliveryFinish()
  const { forecasts } = useForecasts()
  const { setSales } = useSale()
  const { setAlert } = useAlert()

  const classes = useStyle()

  //Functions
  const deleteDelivery = async cod => {
    try {
      const { data } = await api.delete(`deliverys/${cod}`)

      const { data: dataDeliv } = await api.get('deliverys/status/') 
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
        setOpenModalSelectForecastDelivery(false)
        setOpenModalCreateForecastDelivery(true)
        setTypeForecasDelivery(item)
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
      const { data } = await api.get(`deliverys/close/${e.target.value}`)
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
          onClick={() => setOpenModalSelectForecastDelivery(true)}
        >
          <Add />
        </Fab>
      </Box>
      
      {/* Modais*/}
      <Modal
        open={openModalSelectForecastDelivery}
        setOpen={setOpenModalSelectForecastDelivery}
        title={"Selecione:"}
      >
        <Box display="flex" flexDirection="row">
          <Paper className={classes.card}  onClick={() => openModals('forecast', 'create')}>
            <Box>
              <Typography
                variant="h6"
                color="textSecondary"
                className={classes.text}
              >Previsão</Typography>
            </Box>
          </Paper>
          {forecasts.length > 0 &&
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
        title={`Lançar ${typeForecasDelivery === 'forecast' ? 'Previsão' : 'Entrega'}`}
      >
        <ModalDelivery
          setOpen={setOpenModalCreateForecastDelivery}
          type={typeForecasDelivery}
        />
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
