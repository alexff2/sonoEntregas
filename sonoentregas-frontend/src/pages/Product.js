import React, { useState } from 'react'
import api from '../services/api'

import ModalAlert, { openMOdalAlert } from '../components/ModalAlert'

export default function Product(){
  const [ products, setProducts ] = useState([])
  const [ search, setSearch ] = useState()
  const [ typeSeach, setTypeSeach ] = useState('NOME')
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')

  const searchProduct = async () => {
    document.querySelector('#load-product').innerHTML = 'Carregando...'
    try {
      if (search !== '') {
        const { data } = await api.get(`products/${typeSeach}/${search}`)
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (e) {
      setChildrenAlertModal(e)
      openMOdalAlert()
      setProducts([])
    }
    document.querySelector('#load-product').innerHTML = ''
  }
  
  return(
    <div className="container">
      <div className="header-container">
        <h2>Pesquisa de Produtos</h2>
        <div>
          <select onChange={e => setTypeSeach(e.target.value)} name="typeProd" id="typeProd">
            <option value="NOME">Nome</option>
            <option value="COD_ORIGINAL">Código</option>
          </select>
          <input 
            type="text"
            placeholder="Buscar Produtos"
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={searchProduct}>Buscar</button>
        </div>
      </div>

      <div className="body-container">
        <span id="load-product"></span>
        <table>
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
                <td>{item.EST_ATUAL}</td>
                <td>{item.EST_RESERVA}</td>
                <td>{item.EST_DISPONIVEL}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalAlert>{childrenAlertModal}</ModalAlert>
    </div>
  )
}