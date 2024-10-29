import React, { useState } from 'react'

import api from '../../../services/api'

import { useMaintenance } from '../../../context/maintContext'
import { useModalAlert } from '../../../context/modalAlertContext'
import { useAuthenticate } from '../../../context/authContext'

export default function ModalSchedule({ maintSelect, setOpenModalSch }){
  const [disabled, setDisabled] = useState(false)
  const [dateVisit, setDateVisit] = useState('')
  const [hoursVisit, setHoursVisit] = useState('')
  const { setMaintenance } = useMaintenance()
  const { setAlert } = useModalAlert()
  const { userAuth } = useAuthenticate()
  const { ID: idUser } = userAuth

  const scheduleVisit = async () => {
    const { data } = await api.post('maintenance/visit', {
      ID_MAIN: maintSelect.ID,
      DATE: dateVisit,
      HOURS: hoursVisit,
      ID_USER: idUser
    })
    setMaintenance(data)
    setAlert('Visita agendada com sucesso!', 'sucess')
  }

  const rescheduleVisit = async () => {
    try {
      const { data } = await api.put(`maintenance/visit/reschedule/${maintSelect.ID}`, {
        dateVisit,
        hoursVisit
      })
      setMaintenance(data)
      setAlert('Visita reagendada com sucesso!', 'sucess')
    } catch (error) {
      console.log(error)
      !error.response
        ? setAlert('Rede')
        : setAlert('Servidor')
    }
  }

  const submitScheduleVisit = async e => {
    setDisabled(true)
    e.preventDefault()
    try {
      maintSelect.STATUS === 'Agendada'
        ? await rescheduleVisit()
        : await scheduleVisit()

        setOpenModalSch(false)
    } catch (error) {
      console.log(error)
      !error.response
        ? setAlert('Rede')
        : setAlert('Servidor')
    }
  }

  return(<form onSubmit={submitScheduleVisit} className='formSched'>
    <div className="headerBorderCiclo">
      <div>
        <label className="labelField">Assistência Nº: </label>
        <span>{maintSelect.ID}</span>
      </div>
      <div>
        <label className="labelField">Cliente: </label>
        <span>{maintSelect.NOMECLI}</span>
      </div>
      <div>
        <label className="labelField">Endereço: </label>
        <span>{maintSelect.ENDE}</span>
      </div>
      <div>
        <label className="labelField">Telefone: </label>
        <span>{maintSelect.FONE}</span>
      </div>
    </div>
    <div className="bodyBorderCiclo bodyScheVisit">
      <label className="labelField">Agendar visita para: </label>
      <input
        type="date"
        onChange={ e => setDateVisit(e.target.value)} 
        className='dateInput'
        required />
      <input
        type="time"
        className='dateInput'
        onChange={ e => setHoursVisit(e.target.value)} 
        required />
      <button
        type="submit"
        className='btnBorderCiclo bGgreen'
        disabled={disabled}
        >Agendar</button>
    </div>
  </form>)
}