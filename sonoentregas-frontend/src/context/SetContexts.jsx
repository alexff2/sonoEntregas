import React, { useEffect } from 'react'

import api from '../services/api'
import { getLoja, getUser } from '../services/auth'

//Providers
import { useUsers } from './userContext'
import { useMaintenance } from './mainContext'
import { useModalAlert } from './modalAlertContext'

export default function SetContext(){
  const { setUsers } = useUsers()
  const { setMaintenance } = useMaintenance()
  const { setAlert } = useModalAlert()

  useEffect(() =>{
    setTimeout(()=>{
      const setContexts =  async () =>{
        const { cod } = JSON.parse(getLoja())
        const { OFFICE } = JSON.parse(getUser())
  
        const codloja = OFFICE === 'Dev' ? OFFICE : cod
      
        try {
          const { data: dataUser } = await api.get(`/users/${codloja}`)
          const { data: dataMaint } = await api.get(`maintenance/null`)
          
          setMaintenance(dataMaint)
          setUsers(dataUser)
        } catch (error) {
          !error.response
            ? setAlert('Rede')
            : setAlert('Servidor')
        }
      }
      setContexts()
    },0)
  },[setUsers, setMaintenance])
  
  return(<React.Fragment />)
}