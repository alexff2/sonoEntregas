import React, { useState } from 'react'

import './style.css'

import TabSendSale from './TabSendSale'
import SalesOpenClose from './SalesOpenClose'
import { TabSalesProcess } from './TabSaleProcess'
import { TabForecast } from './TabForecast'

export default function Sales(){
  const [ tabs, setTabs ] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
  })

  const openTab = (tab, e) => {
    // Change style buttons
    let tabLinks = document.getElementsByClassName("tabLinks")

    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace("active", "")
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
          className="tabLinks active"
          type="button"
          value="ENVIAR"
          onClick={e => openTab('tab1', e)} />
        <input
          className="tabLinks"
          type="button"
          value="AGUARDANDO"
          onClick={e => openTab('tab2', e)} />
        <input
          className="tabLinks"
          type="button"
          value="PREVISÕES"
          onClick={e => openTab('tab4', e)} />
        <input
          className="tabLinks"
          type="button"
          value="EM PROCESSO"
          onClick={e => openTab('tab3', e)} />
        <input
          className="tabLinks"
          type="button"
          value="FINALIZADAS"
          onClick={e => openTab('tab5', e)} />
      </div>
      
      <div className="tab-body body-container">
        {tabs.tab1 && <TabSendSale />}
        {tabs.tab2 && <SalesOpenClose type={'open'}/>}
        {tabs.tab3 && <TabSalesProcess />}
        {tabs.tab4 && <TabForecast />}
        {tabs.tab5 && <SalesOpenClose type={'close'}/>}
      </div>
    </div>
  )
}
