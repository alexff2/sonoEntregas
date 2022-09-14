import React, { useEffect, useState } from 'react'

import api from '../../../services/api'
import { getDateToSql } from '../../../functions/getDate'

import { useModalAlert } from '../../../context/modalAlertContext'
import { useAuthenticate } from "../../../context/authContext"

import ModalSendSale from './ModalSendSale'
import LoadingCircle from '../../../components/LoadingCircle'

export default function TabSendSale(){
  const [ modal, setModal ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ sales, setSales ] = useState([])
  const [ emissao, setEmissao ] = useState(getDateToSql())
  const [ date, setDate ] = useState(getDateToSql())
  const { shopAuth } = useAuthenticate()
  const { setAlert } = useModalAlert()

  const { cod } = shopAuth

  useEffect(() => {
    setLoading(true)

    api
      .get(`salesshop/${emissao}/${cod}`)
      .then( resp => {
        setSales(resp.data)

        setLoading(false)
      })
      .catch( erro => {
        console.log(erro)

        setAlert(`Não foi possível conectar com servidor, entre em contato com Administrador`)

        setLoading(false)
    })
  }, [cod, emissao, setAlert])

  return(
    <div>
      <div style={{marginBottom: '1rem'}}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}/>
        <button onClick={() => setEmissao(date)}>Buscar</button>
      </div>

      {loading 
        ?<div className='loadingTable'>
          <LoadingCircle/>
        </div>
        :<table className="tab-sales">
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
      }
      
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

