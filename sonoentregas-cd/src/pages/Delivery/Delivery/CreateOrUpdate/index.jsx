import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Divider
} from '@material-ui/core'

import Table from './Table'
import Header from './Header'
import Modal from '../../../../components/Modal'
import ModalAddSale from './ModalAddSale'

import api from '../../../../services/api'

const stateInicialBooleans = {
  isEnableHeader: false,
  renderComponent: false,
}

const stateInitialDelivery = {
  ID: 0,
  ID_DRIVER: 0,
  ID_ASSISTANT: 0,
  ID_ASSISTANT2: 0,
  ID_CAR: 0,
  DESCRIPTION: '',
  D_MOUNTING: new Date().toISOString().slice(0, 10),
}

export default function CreateOrUpdate(){
  const [stateBoolean, setStateBoolean] = useState(stateInicialBooleans)
  const [ openModalAddSale, setOpenModalAddSale ] = useState(false)
  const [ delivery, setDelivery ] = useState(stateInitialDelivery)
  const [ sales, setSales ] = useState([])
  const { id } = useParams()

  useEffect(() => {
    const getDeliverySales = async () => {
      if (id) {
        try {
          const { data } = await api.get(`/delivery/${id}/sales/view`)

          const issuedDate = data.D_MOUNTING.split('/')
  
          setDelivery({
            ...data,
            ID_ASSISTANT2: data.ID_ASSISTANT2 || 0,
            D_MOUNTING: `${issuedDate[2]}-${issuedDate[1]}-${issuedDate[0]}`,
          })
          setSales(data.sales)
        } catch (error) {
          console.log(error)
        }
      }

      setStateBoolean({
        isEnableHeader: !id,
        renderComponent: true
      })
    }

    getDeliverySales()
  }, [id])

  if(!stateBoolean.renderComponent) {
    return (
      <Box padding={2}>
        <Typography variant="h6" gutterBottom>
          Carregando ...
        </Typography>
      </Box>
    )
  }

  return (
    <Box component={Paper}>
      <AppBar position='relative'>
        <Typography variant='h6' align='center' style={{ padding: '12px 0' }}>
          {delivery.ID === 0 ? 'Criação' : 'Atualização'} de Rota
        </Typography>  
      </AppBar>

      <Header
        delivery={delivery}
        setDelivery={setDelivery}
        stateBoolean={stateBoolean}
        setStateBoolean={setStateBoolean}
      />

      <Divider />

      {!stateBoolean.isEnableHeader &&
        <Box padding={4}>
          <Table
            sales={sales}
            setSales={setSales}
            setOpenModalAddSale={setOpenModalAddSale}
          />
        </Box>
      }

      <Modal  open={openModalAddSale} setOpen={setOpenModalAddSale}>
        <ModalAddSale
          setOpen={setOpenModalAddSale}
          setSales={setSales}
          idDelivery={delivery.ID}
        />
      </Modal>
    </Box>
  )
}