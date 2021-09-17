import React, { useEffect, useState } from 'react'

import TabSendSale from './TabSendSale'
import TabSaleSeach from './TabSaleSeach'

export default function Vendas(){

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
    <div className="container">

      <div className="header-container tab">
        <input className="tablinks" type="button" value="ENVIAR" onClick={e => openTab(e)} />
        <input className="tablinks active" type="button" value="CONSULTAR" onClick={e => openTab(e)} />
      </div>
      
      <div className="body-container">
        <div id="ENVIAR" className="tabcontent">
          <TabSendSale />
        </div>

        <div id="CONSULTAR" className="tabcontent">
          <TabSaleSeach />
        </div>
      </div>

    </div>
  )
}
