import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { useMaintenance } from '../../../context/maintenanceContext'

import api from '../../../services/api'

import { ButtonSucess } from '../../../components/Buttons'

const useStyle = makeStyles(theme => ({
  head: {
    display: 'flex',
    flexDirection: 'column',
    '& span': {
      fontWeight: 'bold'
    }
  },
  errorDiv: {
    fontSize: 15,
    color: theme.palette.common.white,
    background: theme.palette.error.light,
    padding: 5
  },
  divMotivo: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export default function ModalProcessMain({ main, setOpen }) {
  const [ date, setDate ] = useState('')
  const [ reasonReturn, setReasonReturn ] = useState('')
  const [ returnMain, setReturnMain ] = useState(false)
  const [ error, setError ] = useState(false)
  const [ childrenError, setChildrenError ] = useState('')
  const [ disabledBtnGrav, setDisabledBtnGrav ] = useState(false)
  const { setMaintenance } = useMaintenance()
  const classe = useStyle()

  const moveToMain = async () => {
    if (date === '') {
      setError(true)
      setChildrenError('Selecione uma data válida!')
    } else {
      try {
        main["date"] = date
        const { data } = await api.put(`/maintenanceattempt/${main.ID_MAIN_ATTEMP}`, main)
        setMaintenance(data)
        setOpen(false)
        setError(false)
        setChildrenError('')
        setDisabledBtnGrav(true)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const finishToMain = async () => {
    if (date === '') {
      setError(true)
      setChildrenError('Selecione uma data válida!')
    } else {
      try {
        main["date"] = date
        main["returnMain"] = returnMain
        main["reasonReturn"] = reasonReturn
        const { data } = await api.put(`/maintenanceattempt/${main.ID_MAIN_ATTEMP}`, main)
        setMaintenance(data)
        setOpen(false)
        setError(false)
        setChildrenError('')
        setDisabledBtnGrav(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return(<React.Fragment>
    <div className={classe.head}>
      <div><span>Assistência Nº: </span>{main.ID}</div>
      <div><span>Status: </span>{main.STATUS}</div>
    </div>

    <div>
      {main.STATUS === 'Em lançamento' && (<>
        <span>Selecione a data do deslocamento: </span>
        <input type="date" onChange={e => setDate(e.target.value)}/> &nbsp;
        <ButtonSucess onClick={moveToMain} disabled={disabledBtnGrav}>Deslocar</ButtonSucess>
      </>)}
      {main.STATUS === 'Em deslocamento' && (<>
        <div>
          Não realizado? 
          <input type="checkbox" onChange={e => setReturnMain(!returnMain)} /><br />
          {returnMain && 
            <div className={classe.divMotivo}>
              Motivo: &nbsp; 
              <textarea onChange={e => setReasonReturn(e.target.value)}></textarea>
            </div>}
        </div>
        <span>Selecione a data de finalização: </span>
        <input type="date" onChange={e => setDate(e.target.value)}/> &nbsp;
        <ButtonSucess onClick={finishToMain} disabled={disabledBtnGrav}>Finalizar</ButtonSucess>
      </>)}
      {error && <div className={classe.errorDiv}><span>{childrenError}</span></div>}
    </div>
  </React.Fragment>)
}