import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)

      const response = await authAPI.login({ email, password })
      console.log("Response from login API:", response.data);
      
      // const { token, user: userData } = response.data

      const {status,message,result} = response.data
       if (status !== "success") {
        setError(message)
        return { success: false, error: message }
      }
      console.log("Response from login API:", response.data);


      console.log("Extracted result:", result)
      const { token, user: userData } = result;

      console.log("Extracted token:", token)
      console.log("user id",userData)


      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { 
        success: true, 
        user: userData 
      }

    } 
    
    catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  const register = async (userData) => {
    try {
      setError(null)

      const response = await authAPI.register(userData)
      
      const {status,message,result} = response.data

      if (status !== "success") {
        setError(message)
        return { success: false, error: message }
      }

      const { token, user: newUser } = result;
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)

      return { success: true, user: newUser }

    } 
    catch (err) {
      // const errorMessage = err.response?.data?.message || 'Registration failed'
      // setError(errorMessage)
      // return { success: false, error: errorMessage }
        const responseData = err.response?.data

        setError(responseData?.message || 'Registration failed')

        return {
          success: false,
          error: responseData?.message,
          errors: responseData?.errors || []   // 🔥 THIS LINE FIXES EVERYTHING
        }
      }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
