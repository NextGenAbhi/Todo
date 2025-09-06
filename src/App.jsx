import React, { useState, useEffect } from 'react'
import AuthForm from './components/AuthForm'
import TodoApp from './components/TodoApp'
import { isAuthenticated, logout } from './utils/auth'
import { authAPI } from './utils/api'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      try {
        const hasTokens = isAuthenticated()
        
        if (!hasTokens) {
          setAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Verify token with backend
        try {
          await authAPI.verifyToken()
          setAuthenticated(true)
        } catch (error) {
          console.error('Token verification failed:', error)
          // Token is invalid, force logout
          logout()
          setAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        logout()
        setAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    // Add a small delay to ensure tokens are properly set
    setTimeout(() => {
      setAuthenticated(true)
    }, 50)
  }

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {authenticated ? (
        <TodoApp onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  )
}

export default App
