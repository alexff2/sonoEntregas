import React, { useEffect, useState } from 'react'

import ModalAlert, { openMOdalAlert } from '../../components/ModalAlert'
import TabSendMain from './TabSendMain'
import TabSeachMain from './TabSeachMain'

export default function Vendas(){
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')

  useEffect(() => {
    document.getElementById('CONSULTAR').style.display = "block"
  }, [])

  const openTab = e => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none"
    }
    tablinks = document.getElementsByClassName("tablinks")
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "")
    }
    document.getElementById(e.target.value).style.display = "block"
    e.currentTarget.className += " active"
  }

  return(
    <div className="container sales-container">

      <div className="tab">
        <input className="tablinks active" value="CONSULTAR" type="button" onClick={e => openTab(e)} />
        <input className="tablinks" value="ENVIAR"  type="button" onClick={e => openTab(e)} />
      </div>
      
      <div className="tab-body body-container">
        <div id="CONSULTAR" className="tabcontent">
          <TabSeachMain
            openMOdalAlert={openMOdalAlert}
            setChildrenAlertModal={setChildrenAlertModal}
          />
        </div>

        <div id="ENVIAR" className="tabcontent">
          <TabSendMain
            openMOdalAlert={openMOdalAlert}
            setChildrenAlertModal={setChildrenAlertModal}
          />
        </div>
      </div>

      <ModalAlert>{childrenAlertModal}</ModalAlert>
    </div>
  )
}
