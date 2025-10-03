import { auth } from '../lib/firebase'

export class TokenService {
  private static instance: TokenService
  private refreshPromise: Promise<string> | null = null

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }
    return TokenService.instance
  }

  async getValidToken(): Promise<string | null> {
    try {
      // Verificar si hay un usuario autenticado
      const user = auth.currentUser
      if (!user) {
        console.log('No authenticated user found')
        return null
      }

      // Verificar si el token actual es válido
      const currentToken = localStorage.getItem('googleAccessToken')
      const expiry = localStorage.getItem('googleTokenExpiry')
      
      if (!currentToken || !expiry) {
        console.log('No stored token found, getting fresh token from Firebase')
        return await this.refreshToken()
      }

      // Verificar si el token ha expirado
      if (Date.now() > parseInt(expiry)) {
        console.log('Token expired, refreshing...')
        return await this.refreshToken()
      }

      return currentToken
    } catch (error) {
      console.error('Error getting valid token:', error)
      return null
    }
  }

  private async refreshToken(): Promise<string> {
    // Evitar múltiples llamadas simultáneas
    if (this.refreshPromise) {
      return await this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    const result = await this.refreshPromise
    this.refreshPromise = null
    return result
  }

  private async performTokenRefresh(): Promise<string> {
    try {
      const user = auth.currentUser
      if (!user) {
        console.log('No user found, need to login')
        throw new Error('No user found, need to login')
      }

      // Forzar renovación del token
      const newToken = await user.getIdToken(true)
      localStorage.setItem('googleAccessToken', newToken)
      localStorage.setItem('googleTokenExpiry', (Date.now() + 3600000).toString())
      
      console.log('Token refreshed successfully')
      return newToken
    } catch (error) {
      console.error('Error refreshing token:', error)
      // Limpiar tokens inválidos
      localStorage.removeItem('googleAccessToken')
      localStorage.removeItem('googleTokenExpiry')
      throw error
    }
  }

  async handleApiError(error: any): Promise<boolean> {
    // Si el error es de credenciales inválidas, intentar renovar el token
    if (error?.error?.includes('Invalid Credentials') || 
        error?.error?.includes('Unauthorized') ||
        error?.status === 401 ||
        error?.message?.includes('Invalid Credentials')) {
      
      console.log('Invalid credentials detected, attempting token refresh...')
      const newToken = await this.refreshToken()
      
      if (newToken) {
        console.log('Token refreshed, retrying request...')
        return true // Indica que se debe reintentar la petición
      } else {
        console.log('Token refresh failed, user needs to login again')
        // Limpiar tokens y redirigir al login
        this.clearTokens()
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        window.location.reload()
        return false
      }
    }
    
    return false
  }

  clearTokens(): void {
    localStorage.removeItem('googleAccessToken')
    localStorage.removeItem('googleTokenExpiry')
  }
}

export const tokenService = TokenService.getInstance()
