import React, { useState } from 'react'
import { makeStyles, TextField } from '@material-ui/core'

import { useMaintenance } from '../../../context/maintenanceContext'

import api from '../../../services/api'

import { ButtonSuccess } from '../../../components/Buttons'

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
    alignItems: 'center',
    margin: ' 0.25rem 0'
  }
}))

export default function ModalProcessMain({ main, setOpen }) {
  const [ date, setDate ] = useState('')
  const [ reasonReturn, setReasonReturn ] = useState('')
  const [ returnMaint, setReturnMaint ] = useState(false)
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
        main["returnMaint"] = returnMaint
        const { data } = await api.put(`/maintenancedeliv/${main.ID_MAINT_DELIV}`, main)
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
        main["returnMaint"] = returnMaint
        main["reasonReturn"] = reasonReturn
        const { data } = await api.put(`/maintenancedeliv/${main.ID_MAINT_DELIV}`, main)
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
        <ButtonSuccess onClick={moveToMain} disabled={disabledBtnGrav}>Deslocar</ButtonSuccess>
      </>)}
      {main.STATUS === 'Em deslocamento' && (<>
        <div>
          Retornado? 
          <input type="checkbox" onChange={e => setReturnMaint(!returnMaint)} /><br />
          {returnMaint && 
            <div className={classe.divMotivo}>
              <TextField
                id='outlined-multiline-static'
                rows={2}
                multiline
                label='Motivo'
                variant='outlined'
                fullWidth
                onChange={e => setReasonReturn(e.target.value)}
                ></TextField>
            </div>}
        </div>
        <span>Selecione a data de finalização: </span>
        <input type="date" onChange={e => setDate(e.target.value)}/> &nbsp;
        <ButtonSuccess onClick={finishToMain} disabled={disabledBtnGrav}>Finalizar</ButtonSuccess>
      </>)}
      {error && <div className={classe.errorDiv}><span>{childrenError}</span></div>}
    </div>
  </React.Fragment>)
}