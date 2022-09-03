import React, { useEffect, useState } from 'react'

import TabSendMain from './TabSendMain'
import TabSeachMain from './TabSeachMain'
import Visit from './Visit'

import { useAuthenticate } from '../../context/authContext'

export default function Vendas(){
  const [ userMaster, setUserMas ] = useState(false)
  const [ tabs, setTabs ] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  })
  const { userAuth } = useAuthenticate()

  const { OFFICE } =  userAuth

  useEffect(() => {
    setUserMas((OFFICE === 'Dev' || OFFICE === 'Master'))
  }, [OFFICE])

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
          value="CONSULTAR"
          type="button"
          onClick={e => openTab('tab1',e)} />

        <input
          className="tablinks"
          value="ENVIAR"
          type="button"
          onClick={e => openTab('tab2', e)} />

        { userMaster &&
          <input
            className="tablinks"
            value="VISITA"
            type="button"
            onClick={e => openTab('tab3', e)} /> }
      </div>
      
      <div className="tab-body body-container">
        {tabs.tab1 &&
          <TabSeachMain />
        }

        {tabs.tab2 &&
          <TabSendMain />
        }
        
        {tabs.tab3 &&
          <Visit/>
        }

      </div>

    </div>
  )
}
