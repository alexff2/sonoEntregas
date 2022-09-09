import React, { useEffect } from 'react'

import api from '../services/api'

//Providers
import { useUsers } from './userContext'
import { useSalesProcess } from './salesProcessContext'
import { useMaintenance } from './maintContext'
import { useModalAlert } from './modalAlertContext'
import { useAuthenticate } from './authContext'

export default function SetContext(){
  const { setUsers } = useUsers()
  const { setMaintenance } = useMaintenance()
  const { setAlert } = useModalAlert()
  const { shopAuth, userAuth } = useAuthenticate()
  const { setSalesProcess } = useSalesProcess()

  useEffect(() =>{
    setTimeout(()=>{
      const setContexts =  async () =>{
        const { cod } = shopAuth
        const { OFFICE } = userAuth
  
        const codloja = OFFICE === 'Dev' ? OFFICE : cod
      
        try {
          const { data: dataUser } = await api.get(`/users/${codloja}`)
          const { data: dataSalesProcess } = await api.get(`/sales/process/${cod}`)
          const { data: dataMaint } = await api.get(`maintenance/null`)
          
          setUsers(dataUser)
          setSalesProcess(dataSalesProcess)
          setMaintenance(dataMaint)
        } catch (error) {
          !error.response
            ? setAlert('Rede')
            : setAlert('Servidor')
        }
      }
      setContexts()
    },0)
  },[setUsers, setSalesProcess, setMaintenance, setAlert, shopAuth, userAuth])
  
  return(<React.Fragment />)
}