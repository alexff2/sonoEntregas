import React, { useEffect, useState } from 'react'

import '../../../styles/pages/sales.css'

import api from '../../../services/api'
import { getLoja } from '../../../services/auth'
import { getDateToSql } from '../../../functions/getDate'

import { useModalAlert } from '../../../context/modalAlertContext'

import ModalSendSale from './ModalSendSale'

export default function TabSendSale(){
  const [ modal, setModal ] = useState([])
  const [ sales, setSales ] = useState([])
  const [ emissao, setEmissao ] = useState(getDateToSql())
  const [ date, setDate ] = useState(getDateToSql())
  const { setOpen: setOpenAlert, setChildrenError, setType } = useModalAlert()

  const { cod } = JSON.parse(getLoja())

  useEffect(() => {
    document.querySelector('#load-sales').innerHTML = 'Carregando...'

    api
      .get(`salesshop/${emissao}/${cod}`)
      .then( resp => {
        setSales(resp.data)

        document.querySelector('#load-sales').innerHTML = ''
      })
      .catch( erro => {
        console.log(erro)

        setChildrenError(`Não foi possível conectar com servidor, entre em contato com Administrador`)
        setOpenAlert()
        setType()

        document.querySelector('#load-sales').innerHTML = ''
    })
  }, [cod, emissao, setOpenAlert, setChildrenError, setType])

  return(
    <div>
      <div style={{marginBottom: '1rem'}}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}/>
        <button onClick={() => setEmissao(date)}>Buscar</button>
      </div>

      <span id="load-sales"></span>

      {/*Table Sales*/}
      <table className="tab-sales">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(item =>(
            <tr 
              key={item.CODIGOVENDA} 
              onClick={()=> setModal([item])}
            >
              <td>{item.CODIGOVENDA}</td>
              <td>{item.NOMECLI}</td>
              <td>{
                Intl
                  .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                  .format(item.TOTALVENDA)
              }</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/*Modal send sales*/
      modal.map( item =>(
        <ModalSendSale 
          key={item.CODIGOVENDA}
          item={item}
          setModal={setModal}
          date={date}
          setEmissao={setEmissao}
        />
      ))
      }
    </div>
  )
}

