import React, { useEffect, useState } from 'react'

import '../../../styles/pages/sales.css'

import api from '../../../services/api'
import { getLoja } from '../../../services/auth'
import getDate from '../../../functions/getDate'

import ModalSendSale from './ModalSendSale'

export default function TabSendSale({ openMOdalAlert, setChildrenAlertModal }){
  const [ modal, setModal ] = useState([])
  const [ sales, setSales ] = useState([])
  const [ emissao, setEmissao ] = useState()
  const [ date, setDate ] = useState()

  const { cod } = JSON.parse(getLoja())

  useEffect(() => {
    document.querySelector('#load-sales').innerHTML = 'Carregando...'

    api
      .get(`${cod}/${emissao ? emissao: getDate()}/vendas`)
      .then( resp => {
        setSales(resp.data)
        
        document.querySelector('#load-sales').innerHTML = ''
      })
      .catch( erro => {
        console.log(erro)

        setChildrenAlertModal(`Não foi possível conectar com servidor, entre em contato com Administrador`)

        openMOdalAlert()
        
        document.querySelector('#load-sales').innerHTML = ''
    })
  }, [cod, emissao, setChildrenAlertModal])

  return(
    <div>
      <div style={{marginBottom: '1rem'}}>
        <input type="date" onChange={e => setDate(e.target.value)}/>
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(item =>(
            <tr 
              key={item.CODIGOVENDA} 
              onClick={!item.STATUS ? ()=> setModal([item]) : null}
            >
              <td>{item.CODIGOVENDA}</td>
              <td>{item.NOMECLI}</td>
              <td>{Intl
                  .NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                  .format(item.TOTALVENDA)}</td>
              <td className={ item.STATUS ? 'green' : 'red'}>
                {item.STATUS ? item.STATUS : 'Pendente'}
              </td>
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
          setChildrenAlertModal={setChildrenAlertModal}
          openMOdalAlert={openMOdalAlert}
          sales={sales}
          setSales={setSales}
        />
      ))
      }
    </div>
  )
}

