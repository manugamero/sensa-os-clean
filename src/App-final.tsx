import React, { useState, useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { AuthContext } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider } from './contexts/ThemeContext'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/calendar')
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly')
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
      
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      
      if (credential?.accessToken) {
        localStorage.setItem('googleAccessToken', credential.accessToken)
      } else {
        // Fallback: usar el ID token de Firebase
        const idToken = await result.user.getIdToken()
        localStorage.setItem('googleAccessToken', idToken)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      <SocketProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-black">
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : user ? (
              <Dashboard />
            ) : (
              <LoginPage onSignIn={handleSignIn} />
            )}
          </div>
        </ThemeProvider>
      </SocketProvider>
    </AuthContext.Provider>
  )
}

export default App
