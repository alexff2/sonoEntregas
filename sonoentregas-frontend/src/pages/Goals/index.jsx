import React, { useState } from 'react'

import TabGoals from './TabGoals'
import TabOnSale from './TabOnSale'

import './styles.css'

export default function Goals() {
  const [ tabs, setTabs ] = useState({
    tab1: false,
    tab2: true,
  })

  const openTab = (tab, e) => {
    // Change style buttons
    let tabLinks = document.getElementsByClassName("tablinks")

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

  return (
    <div className='container sales-container'>
      <div className="tab">
        <input 
          className="tablinks"
          value="METAS"
          type="button"
          onClick={e => openTab('tab1',e)} />

        <input
          className="tablinks active"
          value="PROMOÇÕES"
          type="button"
          onClick={e => openTab('tab2', e)} />
      </div>

      <div className="tab-body body-container">
        {tabs.tab1 && <TabGoals />}
        {tabs.tab2 && <TabOnSale />}
      </div>
    </div>
  )
}