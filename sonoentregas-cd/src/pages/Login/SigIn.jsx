import React, { useState } from 'react'
import { useAuthenticate } from '../../context/authContext'
import { Lock, People } from '@material-ui/icons'

export default function SignIn() {
  const [ userName, setUserName ] = useState()
  const [ password, setPassword ] = useState()
  const { login } = useAuthenticate()

  const handleLogin = async e => {
    e.preventDefault()
    await login({ password, userName })
  }

  return (
    <form onSubmit={handleLogin} className="sign-in-form">
      <h2 className="title">Logar</h2>
      <div className="input-field">
        <People />
        <input
          type="text"
          placeholder="Usuário" 
          onChange={e => setUserName(e.target.value)}/>
      </div>
      <div className="input-field">
        <Lock />
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