import React, { useState, useEffect, useContext, createContext } from "react"

import api from "../services/api"
import { validateFilds } from '../functions/validateFields'
import { useModalAlert } from './modalAlertContext'

const AuthContext = createContext({})

const TOKEN_KEY = "@Sono-token"
const SONO_USER = "@sono-user"
const SONO_SHOP = "@sono-shop"

export default function AuthProvider({ children }){
  const [userAuth, setUserAuth] = useState({})
  const [shopAuth, setShopAuth] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { setAlert } = useModalAlert()

  useEffect(() => {
    const token = getToken()
    if (token) {
      setIsAuthenticated(true)
      const userLocalHistory = getUser()
      const shopLocalHistory = getShop()
  
      setUserAuth(userLocalHistory)
      setShopAuth(shopLocalHistory)
      setToken(token)
    }
  }, [])

  const setToken = token => localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
  const setUser = user => localStorage.setItem(SONO_USER, JSON.stringify(user))
  const setShop = shop => localStorage.setItem(SONO_SHOP, JSON.stringify(shop))

  const getToken = () => localStorage.getItem(TOKEN_KEY)
  const getUser = () => JSON.parse(localStorage.getItem(SONO_USER))
  const getShop = () => JSON.parse(localStorage.getItem(SONO_SHOP))

  const login = async ({ userName, password, selectShop }) => {
    try {
      if (validateFilds([password, userName])) {
        const { data } = await api.post('/authenticated', {
          userName,
          password,
          codloja: selectShop.cod
        })

        const { user , token } = data

        setToken(token)
        setUser(user)
        setShop(selectShop)

        setUserAuth(user)
        setShopAuth(selectShop)
        setIsAuthenticated(true)

      } else {
        setAlert('Preencha todos os campos corretamente.')
      }
    } catch (e) {
      console.log(e.response)
      if(!e.response)
        setAlert('Rede')
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
      getToken
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
    getToken
  } = useContext(AuthContext)

  return {
    isAuthenticated,
    userAuth,
    shopAuth,
    login,
    logout,
    getToken
  }
}