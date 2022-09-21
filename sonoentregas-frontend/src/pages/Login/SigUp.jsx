import React, { useState } from 'react'
import { useAuthenticate } from '../../context/authContext'
import { FiLock, FiUser } from 'react-icons/fi'

export default function SignUp() {
  const [ userName, setUserName ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ rePassword, setRePassword ] = useState('')
  const { login } = useAuthenticate()

  const handleSignUp = async e => {
    e.preventDefault()
    await login({ userName, password, rePassword })
    setUserName('')
    setPassword('')
    setRePassword('')
  }

  return (
    <form onSubmit={handleSignUp} className="sign-up-form">
      <h2 className="title">Cadastro</h2>
      
      <div className="input-field">
        <FiUser />
        <input
          type="text"
          placeholder="Usuário"
          value={userName}
          onChange={e => setUserName(e.target.value)}/>
      </div>
      <div className="input-field">
        <FiLock />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}/>
      </div>

      <div className="input-field">
        <FiLock />
        <input
          type="password"
          placeholder="Repita a senha"
          value={rePassword}
          onChange={e => setRePassword(e.target.value)}/>
      </div>
      <input type="submit" className="btn" value="Cadastrar" />
    </form>
  )
}