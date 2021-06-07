import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

import '../styles/components/modalAlert.css'

export default function ModalALert({ children }){
  const closeModal = () => {
    document.querySelector("#modal-over-alert").style.display = 'none'
  }
  return(
    <div className="modal-overlaw" id="modal-over-alert">
      <div className="modal-alert">
        <div className="headerX">
          <div><AiOutlinePlus /></div>
        </div>
        <div className="content">
          <h2>Atenção!</h2>
          <p>
            { children }
          </p>
          <button onClick={closeModal}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

export function openMOdalAlert() {
  document.querySelector("#modal-over-alert").style.display = 'flex'
}