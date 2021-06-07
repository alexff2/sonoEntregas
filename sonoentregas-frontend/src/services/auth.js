export const TOKEN_KEY = "@Sono-token"

export const authLogin = token => localStorage.setItem(TOKEN_KEY, token)
export const userLogin = user => localStorage.setItem("@sono-user", user)
export const setLoja = loja => localStorage.setItem("@sono-loja", loja)

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUser = () => localStorage.getItem("@sono-user")
export const getLoja = () => localStorage.getItem("@sono-loja")

export const isAuthenticated = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return true
  } else {
    return false
  }
}

export const logout = () => {
  localStorage.clear()
}