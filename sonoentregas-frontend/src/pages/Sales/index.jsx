import React, { useState } from 'react'

import ModalAlert, { openMOdalAlert } from '../../components/ModalAlert'
import TabSendSale from './TabSendSale'
import TabSaleSeach from './TabSaleSeach'

export default function Sales(){
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')
  const [ tabs, setTabs ] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  })

  const openTab = (tab, e) => {
    // Change style buttons
    let tablinks = document.getElementsByClassName("tablinks")

    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("active", "")
    }

    e.currentTarget.className += " active"

    // Change tabs
    let newTabs = {}
    Object.entries(tabs).forEach(([key, value]) => {
      key === tab ? newTabs[key] = true : newTabs[key] = false
    })

    setTabs(newTabs)
  }

  return(
    <div className="container sales-container">

      <div className="tab">
        <input
          className="tablinks active"
          type="button"
          value="ENVIAR"
          onClick={e => openTab('tab1', e)} />
        <input
          className="tablinks"
          type="button"
          value="CONSULTAR"
          onClick={e => openTab('tab2', e)} />
        <input
          className="tablinks"
          type="button"
          value="PREVISÕES"
          onClick={e => openTab('tab3', e)} />
      </div>
      
      <div className="tab-body body-container">
        {tabs.tab1 &&
          <TabSendSale
            openMOdalAlert={openMOdalAlert}
            setChildrenAlertModal={setChildrenAlertModal}
          />
        }

        {tabs.tab2 && 
          <TabSaleSeach
            openMOdalAlert={openMOdalAlert}
            setChildrenAlertModal={setChildrenAlertModal}
          />
        }
        {tabs.tab3 && <div>PREV</div>}
      </div>

      <ModalAlert>{childrenAlertModal}</ModalAlert>
    </div>
  )
}
