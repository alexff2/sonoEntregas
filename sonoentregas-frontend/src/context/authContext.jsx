import React, { useState, useEffect, useContext, createContext } from "react"

import api from "../services/api"
import { validateFields } from '../functions/validateFields'
import { useModalAlert } from './modalAlertContext'

const AuthContext = createContext({})

const TOKEN_KEY = "@Sono-token"
const SONO_USER = "@sono-user"
const SONO_SHOP = "@sono-shop"

const setToken = token => localStorage.setItem(TOKEN_KEY, token)
const setUser = user => localStorage.setItem(SONO_USER, JSON.stringify(user))
const setShop = shop => localStorage.setItem(SONO_SHOP, JSON.stringify(shop))

const getToken = () => localStorage.getItem(TOKEN_KEY)
const getUser = () => JSON.parse(localStorage.getItem(SONO_USER))
const getShop = () => JSON.parse(localStorage.getItem(SONO_SHOP))

export default function AuthProvider({ children }){
  const [userAuth, setUserAuth] = useState({})
  const [shopAuth, setShopAuth] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [noConnection, setNoConnection] = useState(false)
  const { setAlert } = useModalAlert()

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
        setShopAuth(getShop)
        setIsAuthenticated(true)
      } catch (e) {
        if (!e.response){
          console.log(e)
          setNoConnection(true)
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
  }, [setAlert])

  const login = async ({ userName, password, selectShop, setLoading }) => {
    try {
      if (validateFields([password, userName])) {
        const { data } = await api.post('/authenticated', {
          userName,
          password,
          codLoja: selectShop.cod
        })

        const { user , token } = data

        setToken(token)
        setUser(user)
        setShop(selectShop)
        setLoading(false)

        setUserAuth(user)
        setShopAuth(selectShop)
        setIsAuthenticated(true)

      } else {
        setAlert('Preencha todos os campos corretamente.')
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)

      console.log(e.response)

      if(e.response.status === 404){
        setAlert('Rede')
      }
      else if(e.response.status === 400)
        setAlert('Servidor')
      else setAlert(e.response.data)
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
      shopAuth,
      login,
      logout,
      getToken,
      noConnection
    }}>
      { children }
    </AuthContext.Provider>
  )
}

export function useAuthenticate(){
  const {
    isAuthenticated,
    userAuth,
    shopAuth,
    login,
    logout,
    getToken,
    noConnection
  } = useContext(AuthContext)

  return {
    isAuthenticated,
    userAuth,
    shopAuth,
    login,
    logout,
    getToken,
    noConnection
  }
}