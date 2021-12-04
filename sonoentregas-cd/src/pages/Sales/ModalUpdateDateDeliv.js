import React from 'react'

import { useSale } from '../../context/saleContext'
import Modal from '../../components/Modal'
import { ButtonSucess } from '../../components/Buttons'

import api from '../../services/api'

export default function ModalUpdateDateDev({open, setOpen, saleCurrent}){
  const [ dateDeliv, setDateDeliv ] = React.useState('')
  const [ msgError, setMsgError ] = React.useState(false)
  const [ childrenError, setChildrenError ] = React.useState(false)
  const { sales } = useSale()

  const changeDateDeliv = e => {
    setMsgError(false)
    
    if (new Date(e.target.value).setHours(0,0,0,0) >= new Date(saleCurrent.EMISSAO).setHours(0,0,0,0)) {
      setDateDeliv(e.target.value)
    } else {
      e.target.value = ''

      setDateDeliv('')

      setMsgError(true)

      setChildrenError('Data não permitida, por favor escolha uma data maior ou igual a data de emissão')
    }
  }

  const updateDateDeliv = async () => {
    try {
      if (dateDeliv !== '') {
        const { data } = await api.post(`sales/updateDate/${saleCurrent.ID_SALES}`, { dateDeliv, CODLOJA: saleCurrent.CODLOJA })

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
      Nova Data: <input type="date" onChange={changeDateDeliv} style={{marginRight: 10}}/>
      <ButtonSucess children="Salvar" onClick={updateDateDeliv}/>
      {msgError && <div><span style={{color: 'red'}}>{childrenError}</span></div>}
    </Modal>
  )
}