import React, { useEffect } from 'react'

import api from '../services/api'

//Providers
import { useUsers } from './userContext'
import { useMaintenance } from './maintContext'
import { useModalAlert } from './modalAlertContext'
import { useAuthenticate } from './authContext'

export default function SetContext(){
  const { setUsers } = useUsers()
  const { setMaintenance } = useMaintenance()
  const { setAlert } = useModalAlert()
  const { shopAuth, userAuth } = useAuthenticate()

  useEffect(() =>{
    setTimeout(()=>{
      const setContexts =  async () =>{
        const { cod } = shopAuth
        const { OFFICE } = userAuth
  
        const codloja = OFFICE === 'Dev' ? OFFICE : cod
      
        try {
          const { data: dataUser } = await api.get(`/users/${codloja}`)
          const { data: dataMaint } = await api.get(`maintenance/null`)
          
          setUsers(dataUser)
          setMaintenance(dataMaint)
        } catch (error) {
          !error.response
            ? setAlert('Rede')
            : setAlert('Servidor')
        }
      }
      setContexts()
    },0)
  },[setUsers, setMaintenance, setAlert, shopAuth, userAuth])
  
  return(<React.Fragment />)
}