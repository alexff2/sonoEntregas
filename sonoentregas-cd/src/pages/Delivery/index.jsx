import React, { useState } from 'react'
import {
  Box,
  Fab,
  fade,
  makeStyles,
  TextField
} from '@material-ui/core'
import { Add } from '@material-ui/icons'

//Components
import Modal from '../../components/Modal'
import ModalDelivery from './ModalDelivery'
import ModalFinish from './ModalFinish'
import ModalDelivering from './ModalDelivering'
import TabDeliv from './TabDeliv'
import TabPrevision from './TabPrevision'
//Context
import { useDelivery } from '../../context/deliveryContext'
import { useDeliveryFinish } from '../../context/deliveryFinishContext'
import { useSale } from '../../context/saleContext'

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
  }
}))

export default function Delivery() {
  //Modals Open States
  const [ openCreateDeliv, setOpenCreateDeliv ] = useState(false)
  const [ openUpdateDelivery, setOpenUpdateDelivery ] = useState(false)
  const [ openModalDelivering, setOpenModalDelivering ] = useState(false)
  const [ openFinish, setOpenFinish ] = useState(false)
  const [ openViewFinish, setOpenViewFinish ] = useState(false)

  //States
  const [ selectDelivery, setSelectDelivery ] = useState({})
   const { delivery, setDelivery } = useDelivery()
  const { deliveryFinish, setDeliveryFinish } = useDeliveryFinish()
  const { setSales } = useSale()

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
    } catch (error) {
      alert('Erro ao deletar, entre em contato com Administrador')
      console.log(error)
    }
  }
  const openModals = (item, modal) => {
    switch (modal) {
      case 'update':
        setSelectDelivery(item)
        setOpenUpdateDelivery(true)
        break;
      case 'view':
        setSelectDelivery(item)
        setOpenViewFinish(true)
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
  const seachDelivFinish = async e => {
    const { data } = await api.get(`deliverys/close/${e.target.value}`)
    setDeliveryFinish(data)
  }

  return (
    <>
      <Box>
        <TabPrevision openModals={openModals} deleteDelivery={deleteDelivery}/>

        <div className={classes.boxTabHeader} style={{paddingTop: '1rem'}}>
          <span>Rotas em processo</span>
        </div>
        <TabDeliv
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
              onChange={seachDelivFinish}
              className={classes.fieldDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>
        {deliveryFinish.length > 0 &&
          <TabDeliv
            type="close"
            openModals={openModals}
          />
        }

        <Fab 
          color="primary"
          className={classes.btnAdd}
          onClick={() => setOpenCreateDeliv(true)}
        >
          <Add />
        </Fab>
      </Box>
      
      {/* Modais*/}
      <Modal 
        open={openCreateDeliv}
        setOpen={setOpenCreateDeliv}
        title="Lançar Entrega"
      >
        <ModalDelivery
          setOpen={setOpenCreateDeliv}
          selectDelivery={false}
          delivery={delivery}
          setDelivery={setDelivery}
        />
      </Modal>

      <Modal 
        open={openUpdateDelivery}
        setOpen={setOpenUpdateDelivery}
        title="Editar Entrega"
      >
        <ModalDelivery 
          setOpen={setOpenUpdateDelivery} 
          selectDelivery={selectDelivery}
        />
      </Modal>

      <Modal
        open={openFinish}
        setOpen={setOpenFinish}
        title={"Finalizar Entrega"}
      >
        <ModalFinish 
          setOpen={setOpenFinish}
          selectDelivery={selectDelivery}
          type={'open'}
        />
      </Modal>

      <Modal
        open={openViewFinish}
        setOpen={setOpenViewFinish}
        title={"Visualização"}
      >
        <ModalFinish 
          setOpen={setOpenViewFinish}
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
