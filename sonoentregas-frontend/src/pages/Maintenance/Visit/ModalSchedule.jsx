import React, { useState } from 'react'

import api from '../../../services/api'
import { getUser } from '../../../services/auth'

import { useMaintenance } from '../../../context/mainContext'
import { useModalAlert } from '../../../context/modalAlertContext'

export default function ModalSchedule({ maintSelect, setOpenModalSch }){
  const [disabled, setDisabled] = useState(false)
  const [dateVist, setDateVisit] = useState('')
  const [hoursVist, setHoursVisit] = useState('')
  const { setMaintenance } = useMaintenance()
  const { setAlert } = useModalAlert()
  const { ID: idUser } = JSON.parse(getUser())

  const submitScheduleVisit = async e => {
    setDisabled(true)
    e.preventDefault()
    try {
      const { data } = await api.post('maintvisit', {
        ID_MAIN: maintSelect.ID,
        DATE: dateVist,
        HOURS: hoursVist,
        ID_USER: idUser
      })
      setMaintenance(data)
      setAlert('Visita agendada com sucesso!', 'sucess')
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