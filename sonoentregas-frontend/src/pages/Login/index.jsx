import React, { useEffect, useState } from 'react'

import './login.css'

import api from '../../services/api'
import ModalALert, { openMOdalAlert } from '../../components/ModalAlert'

import { useAuthenticate } from '../../context/authContext'

const Login = () => {
  const [modalAlert, setModalAlert] = useState('')
  const [ userName, setUserName ] = useState()
  const [ password, setPassword ] = useState()
  const [ shops, setShops ] = useState([])
  const [ selectShop, setSelectShop ] = useState('')
  const { login } = useAuthenticate()

  useEffect(() => {
    api
      .get('conections')
      .then( resp => {
        const datas = resp.data.filter(shop => shop.database !== 'SONOENTREGAS' && shop.database !== 'SONO')
        setShops(datas)
      })
      .catch( e => {
        openMOdalAlert()
        console.log(e)
        !e.response
          ? setModalAlert('Erro ao conectar com servidor, entre em contato com Bruno!')
          : setModalAlert('Erro ao processar requisição ao servidor, entre em contato com Alexandre!')
      })
  },[])

  const insertSelectShop = shop => {
    setSelectShop(shop)
    
    document.querySelector("#modal-shops").style.display = 'none'
  }

  const handleLogin = async e => {
    e.preventDefault()

    await login({ userName, password, selectShop})
  }

  return(
    <div className="login">
      <div className="login-content">
        <h1>Sono &amp; Art Entregas</h1>
        <div id="shop">Loja: {selectShop.description}</div>
        <form onSubmit={handleLogin}>
          <div className="field">
            <input type="text" placeholder="Usuário..." onChange={e => setUserName(e.target.value)}/>
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Senha..."
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' ? handleLogin(e) : null}
            />
          </div>
          <button type="submit">Logar</button>
        </form>
      </div>

      <div className="modal-overlaw" id="modal-shops">
        <div className="modal">
          <h2>Selecione a loja:</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {shops.map( (shop, i) => (
                <tr key={i} onClick={() => insertSelectShop({cod: i+2, description: shop.database})}>
                  <td>{i+2}</td>
                  <td>{shop.database}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalALert>{modalAlert}</ModalALert>
    </div>
  )
}

export default Login