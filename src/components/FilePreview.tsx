import React, { useState, useEffect } from 'react'
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react'

interface FilePreviewProps {
  file: {
    url: string
    filename: string
    mimeType: string
    size?: number
  }
  onClose: () => void
  onDownload: () => void
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose, onDownload }) => {
  const [zoom, setZoom] = useState(100)
  const [error, setError] = useState(false)

  const isImage = file.mimeType.startsWith('image/')
  const isPDF = file.mimeType === 'application/pdf'
  const isVideo = file.mimeType.startsWith('video/')
  const isAudio = file.mimeType.startsWith('audio/')

  const canPreview = isImage || isPDF || isVideo || isAudio

  useEffect(() => {
    // Reset zoom cuando cambia el archivo
    setZoom(100)
    setError(false)
  }, [file.url])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition-colors flex-shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{file.filename}</h3>
            {file.size && (
              <p className="text-gray-400 text-xs">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isImage && (
            <>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                title="Alejar"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-sm min-w-[4rem] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-2 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                title="Acercar"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </>
          )}
          <button
            onClick={onDownload}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title="Descargar"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {error ? (
          <div className="text-center">
            <p className="text-white mb-4">No se pudo cargar el archivo</p>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Descargar archivo
            </button>
          </div>
        ) : !canPreview ? (
          <div className="text-center">
            <p className="text-white mb-4">Vista previa no disponible para este tipo de archivo</p>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              Descargar archivo
            </button>
          </div>
        ) : isImage ? (
          <img
            src={file.url}
            alt={file.filename}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              transform: `scale(${zoom / 100})`,
              transition: 'transform 0.2s'
            }}
            onError={() => setError(true)}
          />
        ) : isPDF ? (
          <iframe
            src={file.url}
            title={file.filename}
            className="w-full h-full bg-white"
            onError={() => setError(true)}
          />
        ) : isVideo ? (
          <video
            src={file.url}
            controls
            className="max-w-full max-h-full"
            onError={() => setError(true)}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        ) : isAudio ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-white text-lg">{file.filename}</div>
            <audio
              src={file.url}
              controls
              className="w-full max-w-md"
              onError={() => setError(true)}
            >
              Tu navegador no soporta la reproducción de audio.
            </audio>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default FilePreview

