import React, { useState, useEffect } from 'react'
import { FiLock, FiUser } from 'react-icons/fi'

import api from '../../services/api'

import { useAuthenticate } from '../../context/authContext'
import { useModalAlert } from '../../context/modalAlertContext'

export default function SignIn() {
  const [ userName, setUserName ] = useState()
  const [ password, setPassword ] = useState()
  const [ shops, setShops ] = useState([])
  const [ selectShop, setSelectShop ] = useState({cod: 2, description: 'SONO'})
  const { setAlert } = useModalAlert()
  const { login } = useAuthenticate()

  useEffect(() => {
    api
      .get('connections')
      .then( resp => {
        const datas = resp.data.filter((shop, i) => i > 1)
        setShops(datas)
      })
      .catch( e => {
        console.log(e)
        !e.response
          ? setAlert('Erro ao conectar com servidor, entre em contato com Bruno!')
          : setAlert('Erro ao processar requisição ao servidor, entre em contato com Alexandre!')
      })
  },[setAlert])

  const handleSelectShop = event => {
    const shop = shops.filter((shop, i) => i === parseFloat(event.target.value))[0]

    setSelectShop({cod: parseFloat(event.target.value)+2, description: shop.database})
  }

  const handleLogin = async e => {
    e.preventDefault()

    await login({ password, userName, selectShop })
  }

  return (
    <form onSubmit={handleLogin} className="sign-in-form">
      <h2 className="title">Login</h2>

      <select
        className='selectShops'
        onChange={handleSelectShop}
      >
        {shops.map((shop, i) => <option value={i} key={i}>{shop.database}</option>)}
      </select>

      <div className="input-field">
        <FiUser />
        <input
          type="text"
          placeholder="Usuário" 
          onChange={e => setUserName(e.target.value)}/>
      </div>

      <div className="input-field">
        <FiLock />
        <input
          type="password"
          placeholder="Senha"
          onChange={e => setPassword(e.target.value)}/>
      </div>

      <input
        type="submit"
        value="Entrar"
        className="btn solid"
      />
    </form>
  )
}