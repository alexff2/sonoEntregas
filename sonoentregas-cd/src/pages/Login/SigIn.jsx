import React, { useState } from 'react'
import { useAuthenticate } from '../../context/authContext'
import { CircularProgress } from '@material-ui/core'
import { Lock, People } from '@material-ui/icons'

export default function SignIn() {
  const [ userName, setUserName ] = useState()
  const [ password, setPassword ] = useState()
  const [ loading, setLoading ] = useState(false)
  const { login } = useAuthenticate()

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    await login({ password, userName, setLoading })
  }

  return (
    <form onSubmit={handleLogin} className="sign-in-form">
      <h2 className="title">Logar</h2>
      <div className="input-field">
        <People />
        <input
          type="text"
          placeholder="Usuário" 
          disabled={loading}
          onChange={e => setUserName(e.target.value)}/>
      </div>
      <div className="input-field">
        <Lock />
        <input
          type="password"
          placeholder="Senha"
          disabled={loading}
          onChange={e => setPassword(e.target.value)}/>
      </div>
      <button
        type="submit"
        className="btn solid"
        disabled={loading}
      >
        Entrar
        {loading &&  <span>
          <CircularProgress size={25}/>
        </span> }
      </button>
    </form>
  )
}