import React, { useEffect, useState } from 'react'
import {
  makeStyles,
  Divider
} from "@material-ui/core"

import api from '../../services/api'

import { useCars } from '../../context/carsContext'
import { useDrivers } from '../../context/driverContext'
import { useAssistants } from '../../context/assistantContext'

const useStyles = makeStyles(theme => ({
  //Style form select\
  divModal:{
    width: 600
  },
  divDateDelivery: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: '1rem'
  },
}))

export default function ModalSales({sale}){
  const [ selectDelivery, setSelectDelivery ] = useState({})
  const [ car, setCar ] = useState('')
  const [ driver, setDriver ] = useState('')
  const [ assistant, setAssistant ] = useState('')

  const { cars } = useCars()
  const { drivers } = useDrivers()
  const { assistants } = useAssistants()
  const classes = useStyles()

  useEffect(() =>{
    api.get(`sales/detals/${sale.ID_SALES}/${sale.CODLOJA}/Finalizada`)
      .then( resp => {
        setSelectDelivery(resp.data[0])

        const dataCar = cars.filter(car => car.ID === resp.data[0].ID_CAR)
        setCar(dataCar[0].DESCRIPTION)

        const dataDriver = drivers.filter(driver => driver.ID === resp.data[0].ID_DRIVER)
        setDriver(dataDriver[0].DESCRIPTION)

        const dataAssistant = assistants.filter(assistant => assistant.ID === resp.data[0].ID_ASSISTANT)
        setAssistant(dataAssistant[0].DESCRIPTION)
      })
  },[sale])

  return(
    <div className={classes.divModal}>
      <Divider />
      <div>      
        <div><span style={{fontWeight: 700}}>Código: </span>{sale.ID_SALES}</div>
        <div><span style={{fontWeight: 700}}>Cliente: </span>{sale.NOMECLI}</div>
        <div><span style={{fontWeight: 700}}>Motorista: </span>{driver}</div>
        <div><span style={{fontWeight: 700}}>Auxiliar: </span>{assistant}</div>
        <div><span style={{fontWeight: 700}}>Veículo: </span>{car}</div>
        <div><span style={{fontWeight: 700}}>Rota: </span>{selectDelivery.DESCRIPTION}</div>
        <div><span style={{fontWeight: 700}}>Endereço: </span>{sale.ENDERECO}, Num: {sale.NUMERO}, {sale.BAIRRO}, {sale.CIDADE} - {sale.ESTADO}</div>
      </div>
      <Divider />
      <div>
        <div><span style={{fontWeight: 700}}>Observação: </span>{sale.OBS}</div>
        <div><span style={{fontWeight: 700}}>Ponto de ref: </span>{selectDelivery.PONTOREF}</div>
      </div>
      <Divider />
    </div>
  )
}