import React from 'react'
import { Box, Checkbox, InputBase, makeStyles } from '@material-ui/core'

import { useSale } from '../../../context/saleContext'
import { ButtonSuccess, ButtonCancel } from '../../../components/Buttons'

import api from '../../../services/api'

const useStyles = makeStyles( theme => ({
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 500
  },
  inputBase: {
    width: '70%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    paddingLeft: 4
  },
  inputDate: {
    width: '29%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    paddingLeft: 4
  },
  boxButton: {
    width: '100%',
    textAlign: 'end'
  }
}))

export default function ModalUpdateDateDev({setOpen, saleCurrent}){
  const [ unschedule, setUnschedule ] = React.useState(saleCurrent.D_ENTREGA1 ? false : true)
  const [ dateDeliv, setDateDeliv ] = React.useState('')
  const [ obsSchedule, setObsSchedule ] = React.useState('')
  const [ error, setError ] = React.useState(false)
  const [ childrenError, setChildrenError ] = React.useState(false)

  const classes = useStyles()
  const { sales } = useSale()

  const changeDateDeliv = e => {
    setError(false)

    const dateSelect = new Date(e.target.value+'T03:00:00.000Z').setHours(0,0,0,0)
    const dateNow = new Date(saleCurrent.EMISSAO).setHours(0,0,0,0)

    if (dateSelect >= dateNow) {
      setDateDeliv(e.target.value+'T03:00:00.000Z')
    } else {
      e.target.value = ''

      setDateDeliv('')

      setError(true)

      setChildrenError('Data não permitida, por favor escolha uma data maior ou igual a data de emissão')
    }
  }

  const handleUpdateDateDeliv = async () => {
    try {
      if (dateDeliv !== '') {
        const { data } = await api.put(`sales/${saleCurrent.ID}/reschedule`, { 
          dateDeliv,
          OBS_SCHEDULE: obsSchedule
        })

        saleCurrent.D_ENTREGA1 = data

        sales.find( sale => sale.ID === saleCurrent.ID && (sale.D_ENTREGA1 = data))
  
        setOpen(false)
      } else {
        setChildrenError('Data vazia, selecione uma data!')
      } 
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnschedule = async () => {
    try {
      await api.put(`sales/${saleCurrent.ID}/unschedule`)

      saleCurrent.D_ENTREGA1 = null

      sales.find( sale => sale.ID === saleCurrent.ID && (sale.D_ENTREGA1 = null))

      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = () => {
    if (unschedule) {
      handleUnschedule()
    } else {
      handleUpdateDateDeliv()
    }
  }

  return(
    <Box width={'500px'} height={'130px'}>
      <Checkbox checked={unschedule} onChange={e => setUnschedule(e.target.checked)} />
      <span>Sem Agendamento</span>

      {!unschedule && <Box className={classes.box}>
        <InputBase placeholder="Observação" onChange={e => setObsSchedule(e.target.value)} className={classes.inputBase}/>
        <input type="date" onChange={changeDateDeliv} className={classes.inputDate}/>
      </Box>}

      {error && <div><span style={{color: 'red'}}>{childrenError}</span></div>}

      <hr />

      <Box className={classes.boxButton}>
        <ButtonSuccess children="Salvar" onClick={handleSave}/>
        <ButtonCancel children="Cancelar" onClick={() => setOpen(false)}/>
      </Box>
    </Box>
  )
}