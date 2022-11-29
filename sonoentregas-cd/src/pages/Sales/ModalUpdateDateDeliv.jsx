import React from 'react'
import { Box, InputBase, makeStyles } from '@material-ui/core'

import { useSale } from '../../context/saleContext'
import Modal from '../../components/Modal'
import { ButtonSuccess, ButtonCancel } from '../../components/Buttons'

import api from '../../services/api'

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
export default function ModalUpdateDateDev({open, setOpen, saleCurrent}){
  const [ dateDeliv, setDateDeliv ] = React.useState('')
  const [ obsSched, setObsSched ] = React.useState('')
  const [ error, setError ] = React.useState(false)
  const [ childrenError, setChildrenError ] = React.useState(false)

  const classes = useStyles()
  const { sales } = useSale()

  const changeDateDeliv = e => {
    setError(false)
    
    if (new Date(e.target.value).setHours(0,0,0,0) >= new Date(saleCurrent.EMISSAO).setHours(0,0,0,0)) {
      setDateDeliv(e.target.value)
    } else {
      e.target.value = ''

      setDateDeliv('')

      setError(true)

      setChildrenError('Data não permitida, por favor escolha uma data maior ou igual a data de emissão')
    }
  }

  const updateDateDeliv = async () => {
    try {
      if (dateDeliv !== '') {
        const { data } = await api.post(`sales/updateDate/${saleCurrent.ID_SALES}`, { 
          dateDeliv,
          CODLOJA: saleCurrent.CODLOJA,
          OBS_SCHED: obsSched
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

  return(
    <Modal open={open} setOpen={setOpen} title="Agenda nova data de entrega" >
      <Box className={classes.box}>
        <InputBase placeholder="Observação" onChange={e => setObsSched(e.target.value)} className={classes.inputBase}/>
        <input type="date" onChange={changeDateDeliv} className={classes.inputDate}/>
      </Box>

      {error && <div><span style={{color: 'red'}}>{childrenError}</span></div>}

      <hr />

      <Box className={classes.boxButton}>
        <ButtonSuccess children="Salvar" onClick={updateDateDeliv}/>
        <ButtonCancel children="Cancelar" onClick={() => setOpen(false)}/>
      </Box>
    </Modal>
  )
}