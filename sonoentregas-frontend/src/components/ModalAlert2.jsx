import React, { useEffect } from 'react'
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai'

import { useModalAlert } from '../context/modalAlertContext'

import '../styles/components/modalAlert.css'

export default function ModalALert(){
  const { childrenError, open, setOpen, type } = useModalAlert()
  useEffect(()=>{
    open ?
      document.querySelector("#modal-over-alert2").style.display = 'flex'
      : document.querySelector("#modal-over-alert2").style.display = 'none'
  },[open])


  return(
    <div className="modal-overlaw" id="modal-over-alert2">
      <div className="modal-alert">
        {type === 'sucess'?
          <div className="headerX" style={{backgroundColor: 'var(--green)'}}>
            <div style={{transform: 'unset'}}><AiOutlineCheck /></div>
          </div>
          :
          <div className="headerX">
            <div><AiOutlinePlus /></div>
          </div>
        }
        <div className="content">
          <h2>Atenção!</h2>
          <p>
            { childrenError }
          </p>
          <button 
            style={type === 'sucess' ? {backgroundColor: 'var(--green)'}:{}} 
            onClick={()=>setOpen(false)}
          >Fechar</button>
        </div>
      </div>
    </div>
  )
}
