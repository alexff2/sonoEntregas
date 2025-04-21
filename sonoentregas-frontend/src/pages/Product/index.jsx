import React, { useState } from 'react'
import api from '../../services/api'

import ModalAlert, { openMOdalAlert } from '../../components/ModalAlert'
import LoadingCircle from '../../components/LoadingCircle'

export default function Product(){
  const [ loading, setLoading ] = useState(false)
  const [ products, setProducts ] = useState([])
  const [ search, setSearch ] = useState()
  const [ typeSearch, setTypeSearch ] = useState('NOME')
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')

  const searchProduct = async () => {
    setLoading(true)
    try {
      if (search !== '') {
        const { data } = await api.get('products', {
          params: {
            search,
            typeSearch
          }
        }
        )
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (e) {
      setChildrenAlertModal(e)
      openMOdalAlert()
      setProducts([])
    }
    setLoading(false)
  }
  
  return(
    <div className="container">
      <div className="header-container">
        <h2>Pesquisa de Produtos</h2>
        <div>
          <select onChange={e => setTypeSearch(e.target.value)} name="typeProd" id="typeProd">
            <option value="NOME">Nome</option>
            <option value="COD_ORIGINAL">Código</option>
          </select>
          <input 
            type="text"
            placeholder="Buscar Produtos"
            onChange={e => setSearch(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchProduct()}
          />
          <button onClick={searchProduct}>Buscar</button>
        </div>
      </div>

      <div className="body-container">
        {loading 
          ?<div className='loadingTable'>
            <LoadingCircle/>
          </div>
          :<table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descricão</th>
              <th>Estoque</th>
              <th>Reserva</th>
              <th>Disponível</th>
            </tr>
          </thead>
          <tbody>
            {products.map(item => (
              <tr key={item.COD_ORIGINAL}>
                <td>{item.COD_ORIGINAL}</td>
                <td>{item.NOME}</td>
                <td>
                  { process.env.REACT_APP_STOCK_BEEP === '1'
                      ? item.EST_BEEP
                      : item.EST_KARDEX
                  }
                </td>
                <td>{item.EST_RESERVA - item.QTD_MAINTENANCE}</td>
                <td>
                  { process.env.REACT_APP_STOCK_BEEP === '1'
                      ? (item.EST_BEEP - item.EST_RESERVA - item.QTD_MAINTENANCE)
                      : (item.EST_KARDEX - item.EST_RESERVA - item.QTD_MAINTENANCE)
                  }
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        }
        
      </div>
      <ModalAlert>{childrenAlertModal}</ModalAlert>
    </div>
  )
}