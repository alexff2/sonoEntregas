import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Cached } from '@material-ui/icons'

import { useSale } from '../context/saleContext'
import { useDelivery } from '../context/deliveryContext'
import { useDeliveryFinish } from '../context/deliveryFinishContext'
import { useMaintenance } from '../context/maintenanceContext'

import { getDateSql } from '../functions/getDates'
import api from '../services/api'

import ModalALert from './ModalAlert'

const useStyles = makeStyles( theme => ({
  btnUpdate: {
    position: 'fixed',
    right: theme.spacing(3),
    top: theme.spacing(1),
    border: 'none',
    borderRadius: 8,
    backgroundColor: theme.palette.primary.main,
    padding: 10,
    color: theme.palette.common.white,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    zIndex: 1110
  }
}))

export default function BtnUpdate(){
  const [ childrenModalAlert, setChildrenModalAlert ] = useState('')
  const [ openModalAlert, setOpenModalAlert ] = useState(false)

  const { setSales } = useSale()
  const { setDelivery } = useDelivery()
  const { setDeliveryFinish } = useDeliveryFinish()
  const { setMaintenance } = useMaintenance()
  const classes = useStyles()

  const updateSys = async () => {
    try {
      const { data: dataSales } = await api.get('sales/false/false/Aberta/null')
      const { data: dataDeliv } = await api.get('deliverys/open')
      const { data: dataDelivFinsh } = await api.get(`deliverys/close/${getDateSql()}`)
      const { data: dataMain } = await api.get('/maintenancedeliv')

      setSales(dataSales)
      setDelivery(dataDeliv)
      setDeliveryFinish(dataDelivFinsh)
      setMaintenance(dataMain)
    } catch (error) {
      console.log(error)
      setOpenModalAlert(true)
      setChildrenModalAlert('Erro ao atualizar sistema, entre em contato com ADM!')
    }
  }

  return(
    <>
      <button className={classes.btnUpdate} onClick={()=> updateSys()}>
        <Cached />
      </button>
      <ModalALert
        children={childrenModalAlert}
        open={openModalAlert}
        setOpen={setChildrenModalAlert}
      />
    </>
  )
}