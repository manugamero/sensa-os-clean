import React, { useState, useEffect } from 'react'
import { AuthContext } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Dashboard from './components/Dashboard-simple'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [user, setUser] = useState<any>({ 
    email: 'test@example.com', 
    displayName: 'Test User' 
  })
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-black">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : user ? (
            <Dashboard />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">sensa os</h1>
                <button
                  onClick={() => setUser({ email: 'test@example.com', displayName: 'Test User' })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Entrar como Test User
                </button>
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default App
