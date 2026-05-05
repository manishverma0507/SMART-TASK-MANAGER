import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { authApi, setAuthToken } from '../services/api'
import { AuthContext } from './auth-context'

const STORAGE_KEY = 'team-task-manager-auth'
const THEME_KEY = 'team-task-manager-theme'
const initialToken = localStorage.getItem(STORAGE_KEY) || ''
const initialTheme = localStorage.getItem(THEME_KEY) === 'dark'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(initialToken)
  const [loading, setLoading] = useState(Boolean(initialToken))
  const [darkMode, setDarkMode] = useState(initialTheme)

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (!token) {
      setAuthToken(null)
      return
    }

    setAuthToken(token)
    authApi
      .me()
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY)
        setAuthToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const persistAuth = useCallback((responseData) => {
    localStorage.setItem(STORAGE_KEY, responseData.token)
    setAuthToken(responseData.token)
    setToken(responseData.token)
    setUser({
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    })
  }, [])

  const signup = useCallback(async (payload) => {
    const { data } = await authApi.signup(payload)
    persistAuth(data)
    toast.success('Account created successfully')
    return data
  }, [persistAuth])

  const login = useCallback(async (payload) => {
    const { data } = await authApi.login(payload)
    persistAuth(data)
    toast.success(`Welcome back, ${data.name}`)
    return data
  }, [persistAuth])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthToken(null)
    setToken('')
    setUser(null)
    toast.success('Logged out')
  }, [])

  const toggleDarkMode = useCallback(() => setDarkMode((current) => !current), [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      darkMode,
      signup,
      login,
      logout,
      setUser,
      toggleDarkMode,
    }),
    [darkMode, loading, login, logout, signup, toggleDarkMode, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
