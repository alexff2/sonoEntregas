import React, { useEffect, useState } from 'react'

import ModalAlert, { openMOdalAlert } from '../../components/ModalAlert'
import TabSendSale from './TabSendSale'
import TabSaleSeach from './TabSaleSeach'

export default function Vendas(){
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')

  useEffect(() => {
    document.getElementById('CONSULTAR').style.display = "block";
  }, [])

  const openTab = e => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(e.target.value).style.display = "block";
    e.currentTarget.className += " active";
  }

  return(
    <div className="container sales-container">

      <div className="tab">
        <input className="tablinks" type="button" value="ENVIAR" onClick={e => openTab(e)} />
        <input className="tablinks active" type="button" value="CONSULTAR" onClick={e => openTab(e)} />
      </div>
      
      <div className="tab-body body-container">
        <div id="ENVIAR" className="tabcontent">
          <TabSendSale
            openMOdalAlert={openMOdalAlert}
            setChildrenAlertModal={setChildrenAlertModal}
          />
        </div>

        <div id="CONSULTAR" className="tabcontent">
          <TabSaleSeach
            openMOdalAlert={openMOdalAlert}
            setChildrenAlertModal={setChildrenAlertModal}
          />
        </div>
      </div>

      <ModalAlert>{childrenAlertModal}</ModalAlert>
    </div>
  )
}
