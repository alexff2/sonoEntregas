import React, { useEffect, useState } from 'react'

import '../styles/pages/login.css'

import { authLogin, userLogin, setLoja } from '../services/auth'
import api from '../services/api'
import validateFilds from '../functions/validateFields'

import ModalAlert, { openMOdalAlert } from '../components/ModalAlert'

const Login = ({history}) => {
  const [ user, setUser ] = useState()
  const [ password, setPassword ] = useState()
  const [ shops, setShops ] = useState([])
  const [ selectShop, setSelectShop ] = useState('')
  const [ childrenAlertModal, setChildrenAlertModal ] = useState('Vazio')

  useEffect(() => {
    api
      .get('conections')
      .then( resp => {
        const datas = resp.data.filter(shop => shop.database !== 'SONOENTREGAS' && shop.database !== 'SONO')
        setShops(datas)
      })
      .catch( e => {
        setChildrenAlertModal(`Sem conexão com o servidor. Erro: ${e}`)
        openMOdalAlert()
      })
  },[])

  const insertSelectShop = shop => {
    setSelectShop(shop)
    
    document.querySelector("#modal-shops").style.display = 'none'
  }

  const login = async e => {
    e.preventDefault()
    
    try {
      if (validateFilds([password, user])) {
        const { data } = await api.post('/login', {
          user, password, codloja: selectShop.cod
        })

        if (data) {
          authLogin('tokenteste123')

          userLogin(JSON.stringify({ID: data.ID, NAME: data.DESCRIPTION}))
          
          setLoja(JSON.stringify(selectShop))
          
          history.push('/home')
        } else {
          setChildrenAlertModal('Usuário não encontrado, verifique seu usuário e senha novamente.')

          openMOdalAlert()
        }

      } else {
        setChildrenAlertModal('Preencha todos os campos corretamente.')

        openMOdalAlert()
      }
    } catch (error) {
        setChildrenAlertModal(`Sem conexão com o servidor. Erro: ${error}`)

        openMOdalAlert()
    }
  }

  return(
    <div className="login">
      <div className="login-content">
        <h1>Sono &amp; Art Entregas</h1>
        <div id="shop">Loja: {selectShop.description}</div>
        <form onSubmit={login}>
          <div className="field">
            <input type="text" placeholder="Usuário..." onChange={e => setUser(e.target.value)}/>
          </div>
          <div className="field">
            <input type="password" placeholder="Senha..." onChange={e => setPassword(e.target.value)}/>
          </div>
          <button type="submit">Logar</button>
        </form>
      </div>
      
      <ModalAlert>{childrenAlertModal}</ModalAlert>
      
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
    </div>
  )
}

export default Login