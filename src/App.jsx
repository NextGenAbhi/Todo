import React, { useState, useEffect } from 'react'
import AuthForm from './components/AuthForm'
import TodoApp from './components/TodoApp'
import { isAuthenticated } from './utils/auth'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      setAuthenticated(isAuthenticated())
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleAuthSuccess = () => {
    setAuthenticated(true)
  }

  const handleLogout = () => {
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
