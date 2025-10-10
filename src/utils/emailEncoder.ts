// Diferentes estrategias de encoding para Gmail API

export const emailEncoders = {
  // Método 1: Solo ASCII (sin caracteres especiales)
  asciiOnly: (message: string): string => {
    return btoa(message)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },

  // Método 2: TextEncoder con conversión byte a byte
  textEncoder: (message: string): string => {
    const bytes = new TextEncoder().encode(message)
    let binary = ''
    bytes.forEach(byte => binary += String.fromCharCode(byte))
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },

  // Método 3: Escape manual de Unicode
  unicodeEscape: (message: string): string => {
    const utf8Bytes: number[] = []
    for (let i = 0; i < message.length; i++) {
      const charCode = message.charCodeAt(i)
      if (charCode < 0x80) {
        utf8Bytes.push(charCode)
      } else if (charCode < 0x800) {
        utf8Bytes.push(0xc0 | (charCode >> 6))
        utf8Bytes.push(0x80 | (charCode & 0x3f))
      } else if (charCode < 0x10000) {
        utf8Bytes.push(0xe0 | (charCode >> 12))
        utf8Bytes.push(0x80 | ((charCode >> 6) & 0x3f))
        utf8Bytes.push(0x80 | (charCode & 0x3f))
      }
    }
    const binary = String.fromCharCode(...utf8Bytes)
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },

  // Método 4: Chunked encoding para manejar arrays grandes
  chunkedEncoder: (message: string): string => {
    const bytes = new TextEncoder().encode(message)
    const chunkSize = 1024
    let binary = ''
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize)
      binary += String.fromCharCode(...Array.from(chunk))
    }
    
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },

  // Método 5: Reemplazar caracteres problemáticos
  safeReplace: (message: string): string => {
    // Reemplazar caracteres con acento por versiones sin acento
    const safeMessage = message
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
      .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I')
      .replace(/Ó/g, 'O').replace(/Ú/g, 'U').replace(/Ñ/g, 'N')
    
    return btoa(safeMessage)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}

// Método actual recomendado
export const encodeEmailForGmail = emailEncoders.chunkedEncoder

