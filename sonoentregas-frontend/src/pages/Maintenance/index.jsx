import React, { useEffect, useState } from 'react'

import TabSendMain from './TabSendMain'
import TabSeachMain from './TabSeachMain'
import Visit from './Visit'

import { useAuthenticate } from '../../context/authContext'

export default function Vendas(){
  const [ userMaster, setUserMas ] = useState(false)
  const { userAuth } = useAuthenticate()

  const { OFFICE } =  userAuth

  useEffect(() => {
    document.getElementById('CONSULTAR').style.display = "block"
    setUserMas((OFFICE === 'Dev' || OFFICE === 'Master'))
  }, [OFFICE])

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
        <input 
          className="tablinks active"
          value="CONSULTAR"
          type="button"
          onClick={e => openTab(e)} />

        <input
          className="tablinks"
          value="ENVIAR"
          type="button"
          onClick={e => openTab(e)} />

        { userMaster &&
          <input
            className="tablinks"
            value="VISITA"
            type="button"
            onClick={e => openTab(e)} /> }
      </div>
      
      <div className="tab-body body-container">
        <div id="CONSULTAR" className="tabcontent">
          <TabSeachMain />
        </div>

        <div id="ENVIAR" className="tabcontent">
          <TabSendMain />
        </div>
        <div id="VISITA" className="tabcontent">
          <Visit/>
        </div>
      </div>

    </div>
  )
}
