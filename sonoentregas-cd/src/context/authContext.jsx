import React, { useState, useEffect, useContext, createContext } from "react"

import api from "../services/api"
import { validateFields } from '../functions/validateFields'
import { useAlert } from './alertContext'

const AuthContext = createContext({})

const TOKEN_KEY = "@Sono-token"
const SONO_USER = "@sono-user"

const setToken = token => localStorage.setItem(TOKEN_KEY, token)
const setUser = user => localStorage.setItem(SONO_USER, JSON.stringify(user))

const getToken = () => localStorage.getItem(TOKEN_KEY)
const getUser = () => JSON.parse(localStorage.getItem(SONO_USER))

export default function AuthProvider({ children }){
  const [userAuth, setUserAuth] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const { setAlert } = useAlert()

  useEffect(() => {
    const validations = async () => {
      const token = getToken()

      try {
        if (!token) {
          setIsAuthenticated(false)
          return
        }

        await api.get('token/validation', {
          params: {
            token
          }
        })

        setUserAuth(getUser())
      } catch (e) {
        if (!e.response){
          console.log(e)
          setAlert('Rede')
        } else if (e.response.status === 401){
          console.log(e.response.data)
          setAlert('Sua sessão expirou, entre novamente na aplicação!')
          setIsAuthenticated(false)
          localStorage.clear()
        } else if (e.response.status === 400){
          console.log(e.response.data)
          setAlert('Servidor')
        } else {
          console.log(e.response.data)
        }
      }
    }

    validations()
  },[setAlert])

  const login = async ({ userName, password, setLoading }) => {
    try {
      if (validateFields([password, userName])) {
        const { data } = await api.post('/authenticated', {
          userName,
          password,
          codLoja: 1
        })

        const { user , token } = data

        setToken(token)
        setUser(user)

        setUserAuth(user)
        setIsAuthenticated(true)

      } else {
        setLoading(false)
        return setAlert('Preencha todos os campos corretamente.')
      }
    } catch (e) {
      setLoading(false)

      console.log(e.response)

      if (!e.response)
        setAlert('Rede')
      else if (e.response.status === 400)
        setAlert('Servidor')
      else
        setAlert(e.response.data)
    }
  }

  const signUp = async ({ userName, password, rePassword }) => {
    try {
      if (validateFields([password, userName, rePassword])) {
        if (password !== rePassword) {
          return setAlert('Senhas não correspondem!')
        }

        await api.post('users', {
          codloja: 1,
          description: userName,
          active: 1,
          office: 'User',
          password: password
        })

        return setAlert('Solicitação de cadastro enviada com sucesso, entre em contato com ADM para liberar acesso!', 'sucess')
      } else {
        return setAlert('Preencha todos os campos corretamente.')
      }
    } catch (e) {
      console.log(e.response)
      if (!e.response)
        setAlert('Rede')
      else if (e.response.status === 400)
        setAlert('Servidor')
      else
        setAlert(e.response.data)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.clear()
  }

  return(
    <AuthContext.Provider value={{
      isAuthenticated,
      userAuth,
      login,
      signUp,
      logout,
    }}>
      { children }
    </AuthContext.Provider>
  )
}

export function useAuthenticate(){
  const {
    isAuthenticated,
    userAuth,
    login,
    signUp,
    logout
  } = useContext(AuthContext)

  return {
    isAuthenticated,
    userAuth,
    login,
    signUp,
    logout
  }
}