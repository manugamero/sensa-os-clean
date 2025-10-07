import { useState, useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { AuthContext } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
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

  const signInWithGoogle = async () => {
    try {
      console.log('Iniciando login con Google...')
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/calendar')
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly')
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
      console.log('Provider configurado:', provider)
      const result = await signInWithPopup(auth, provider)
      console.log('Login exitoso:', result)
      
      // Obtener el token de acceso de Google
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (credential?.accessToken) {
        localStorage.setItem('googleAccessToken', credential.accessToken)
        localStorage.setItem('googleTokenExpiry', (Date.now() + 3600000).toString()) // 1 hora
        console.log('Token de Google almacenado:', credential.accessToken)
      } else {
        // Si no se puede obtener el token, usar el ID token de Firebase
        console.log('Usando ID token de Firebase como fallback')
        const idToken = await result.user.getIdToken()
        localStorage.setItem('googleAccessToken', idToken)
        localStorage.setItem('googleTokenExpiry', (Date.now() + 3600000).toString())
        console.log('ID token almacenado como fallback')
      }
    } catch (error: any) {
      console.error('Error signing in:', error)
      alert('Error al iniciar sesión: ' + error.message)
    }
  }


  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} />
  }

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      <SocketProvider>
        <ThemeProvider>
          <SettingsProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-black">
              {loading ? (
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                </div>
              ) : user ? (
                <Dashboard />
              ) : (
                <LoginPage onSignIn={signInWithGoogle} />
              )}
            </div>
          </SettingsProvider>
        </ThemeProvider>
      </SocketProvider>
    </AuthContext.Provider>
  )
}

export default App
