import React, { useEffect, useState } from 'react'

import '../styles/pages/login.css'

import { authLogin, userLogin, setLoja } from '../services/auth'
import api from '../services/api'
import { validateFilds } from '../functions/validateFields'
import ModalALert, { openMOdalAlert } from '../components/ModalAlert'

const Login = ({history}) => {
  const [modalAlert, setModalAlert] = useState('')
  const [ user, setUser ] = useState()
  const [ password, setPassword ] = useState()
  const [ shops, setShops ] = useState([])
  const [ selectShop, setSelectShop ] = useState('')

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

  const login = async e => {
    e.preventDefault()
    
    try {
      if (validateFilds([password, user])) {
        const resp = await api.post('/login', {
          user, password, codloja: selectShop.cod
        })
        const { data, status } = resp

        if (status === 201) {
          authLogin('tokenteste123')

          userLogin(JSON.stringify({ID: data.ID, NAME: data.DESCRIPTION, OFFICE: data.OFFICE}))
          
          setLoja(JSON.stringify(selectShop))
          
          history.push('home')
        } else {
          console.log(resp)
          openMOdalAlert()
          setModalAlert('Usuário não encontrado, verifique seu usuário e senha novamente.')
        }

      } else {
        openMOdalAlert()
        setModalAlert('Preencha todos os campos corretamente.')
      }
    } catch (e) {
      openMOdalAlert()
      console.log(e.response)
      if(!e.response)
        setModalAlert('Erro na rede, entre em contato com Bruno!')
      else if(e.response.status === 400)
        setModalAlert('Erro no servidor, entre em contato com Alexadre!')
      else setModalAlert(e.response.data)
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
            <input
              type="password"
              placeholder="Senha..."
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' ? login(e) : null}
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