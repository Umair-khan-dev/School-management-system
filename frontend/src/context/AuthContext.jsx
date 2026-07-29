import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sms_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('sms_token', data.token)
      localStorage.setItem('sms_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      let message = 'Login failed. Please try again.'
      if (err.response?.data?.message) {
        message = err.response.data.message
      } else if (!err.response) {
        message = 'Cannot reach the server. Check that the backend is running and VITE_API_URL matches backend PORT in .env.'
      }
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('sms_token')
    localStorage.removeItem('sms_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
