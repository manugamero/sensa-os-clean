const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { google } = require('googleapis')
const admin = require('firebase-admin')

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Firebase Admin SDK
let serviceAccount
try {
  serviceAccount = require('./firebase-service-account.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  console.log('✅ Firebase Admin SDK inicializado correctamente')
} catch (error) {
  console.log('⚠️  Firebase Admin SDK no configurado. Usando modo demo.')
  console.log('   Para usar APIs reales, configura firebase-service-account.json')
}

// Middleware
app.use(cors())
app.use(express.json())

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`)
  }
})
const upload = multer({ storage })

// In-memory storage (replace with database in production)
const todos = new Map()
const rooms = new Map()
const messages = new Map()

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.log('❌ No se encontró token de autorización')
    return res.sendStatus(401)
  }

  try {
    // Si Firebase Admin no está configurado, usar autenticación simple
    if (!admin.apps.length) {
      console.log('⚠️ Firebase Admin no configurado, usando autenticación simple')
      req.user = { email: 'usuario@ejemplo.com' }
      return next()
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    console.log('✅ Usuario autenticado:', req.user.email)
    next()
  } catch (error) {
    console.error('❌ Error verifying token:', error.message)
    // En caso de error, permitir acceso con usuario de ejemplo
    console.log('⚠️ Usando usuario de ejemplo debido a error de autenticación')
    req.user = { email: 'usuario@ejemplo.com' }
    next()
  }
}

// Google Calendar API
app.post('/api/calendar/events', authenticateToken, async (req, res) => {
  try {
    console.log('📅 Recibiendo solicitud de eventos del calendario')
    const { accessToken } = req.body
    
    console.log('Token recibido:', accessToken ? 'Sí' : 'No')
    
    if (!accessToken) {
      console.error('❌ No se recibió el token de acceso')
      return res.status(400).json({ error: 'Access token required' })
    }


    console.log('🔑 Configurando OAuth2 con token:', accessToken.substring(0, 20) + '...')
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessToken
    })

    console.log('📅 Consultando Google Calendar API...')
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    })

    console.log('✅ Eventos obtenidos:', response.data.items?.length || 0)
    res.json(response.data.items || [])
  } catch (error) {
    console.error('❌ Error fetching calendar events:', error.message)
    res.status(500).json({ error: 'Failed to fetch events: ' + error.message })
  }
})

app.post('/api/calendar/events/create', authenticateToken, async (req, res) => {
  try {
    const { accessToken, ...eventData } = req.body
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' })
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessToken
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const event = {
      summary: eventData.summary,
      start: eventData.start,
      end: eventData.end,
      attendees: eventData.attendees,
      description: eventData.description,
      conferenceData: eventData.conferenceData
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1
    })

    res.json(response.data)
  } catch (error) {
    console.error('Error creating calendar event:', error)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

// Gmail API
app.post('/api/gmail/emails', authenticateToken, async (req, res) => {
  try {
    console.log('📧 Recibiendo solicitud de emails')
    const { accessToken } = req.body
    
    console.log('Token recibido:', accessToken ? 'Sí' : 'No')
    
    if (!accessToken) {
      console.error('❌ No se recibió el token de acceso')
      return res.status(400).json({ error: 'Access token required' })
    }


    console.log('🔑 Configurando OAuth2 con token:', accessToken.substring(0, 20) + '...')
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessToken
    })

    console.log('📧 Consultando Gmail API...')
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    })

    const messages = response.data.messages || []
    console.log('📧 Mensajes encontrados:', messages.length)
    const emails = []

    for (const message of messages) {
      const messageData = await gmail.users.messages.get({
        userId: 'me',
        id: message.id
      })

      const headers = messageData.data.payload.headers
      const subject = headers.find(h => h.name === 'Subject')?.value || ''
      const from = headers.find(h => h.name === 'From')?.value || ''
      const date = headers.find(h => h.name === 'Date')?.value || ''

      emails.push({
        id: message.id,
        subject,
        from,
        snippet: messageData.data.snippet,
        date,
        isRead: !messageData.data.labelIds?.includes('UNREAD'),
        hasAttachments: messageData.data.payload.parts?.some(part => part.filename) || false
      })
    }

    console.log('✅ Emails procesados:', emails.length)
    res.json(emails)
  } catch (error) {
    console.error('❌ Error fetching emails:', error.message)
    res.status(500).json({ error: 'Failed to fetch emails: ' + error.message })
  }
})

app.post('/api/gmail/emails/:id/read', authenticateToken, async (req, res) => {
  try {
    const { accessToken } = req.body
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' })
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: accessToken
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    await gmail.users.messages.modify({
      userId: 'me',
      id: req.params.id,
      resource: {
        removeLabelIds: ['UNREAD']
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error marking email as read:', error)
    res.status(500).json({ error: 'Failed to mark email as read' })
  }
})

// Todos API
app.get('/api/todos', authenticateToken, (req, res) => {
  const userTodos = Array.from(todos.values()).filter(todo => 
    todo.author === req.user.email || todo.mentions.includes(req.user.email)
  )
  res.json(userTodos)
})

app.post('/api/todos', authenticateToken, (req, res) => {
  const todo = {
    id: uuidv4(),
    title: req.body.title,
    content: req.body.content,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mentions: req.body.mentions || [],
    author: req.user.email
  }

  todos.set(todo.id, todo)
  io.emit('todo:created', todo)
  res.json(todo)
})

app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const todo = todos.get(req.params.id)
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  const updatedTodo = {
    ...todo,
    ...req.body,
    updatedAt: new Date().toISOString()
  }

  todos.set(req.params.id, updatedTodo)
  io.emit('todo:updated', updatedTodo)
  res.json(updatedTodo)
})

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const todo = todos.get(req.params.id)
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  todos.delete(req.params.id)
  io.emit('todo:deleted', req.params.id)
  res.json({ success: true })
})

// Chat API
app.get('/api/chat/rooms', authenticateToken, (req, res) => {
  const userRooms = Array.from(rooms.values()).filter(room => 
    room.participants.includes(req.user.email)
  )
  res.json(userRooms)
})

app.post('/api/chat/rooms', authenticateToken, (req, res) => {
  const room = {
    id: uuidv4(),
    name: req.body.name,
    participants: [...req.body.participants, req.user.email],
    createdAt: new Date().toISOString()
  }

  rooms.set(room.id, room)
  io.emit('room:created', room)
  res.json(room)
})

app.get('/api/chat/rooms/:id/messages', authenticateToken, (req, res) => {
  const roomMessages = messages.get(req.params.id) || []
  res.json(roomMessages)
})

app.post('/api/chat/rooms/:id/messages', authenticateToken, (req, res) => {
  const message = {
    id: uuidv4(),
    content: req.body.content,
    author: req.user.name,
    authorEmail: req.user.email,
    timestamp: new Date().toISOString(),
    type: req.body.type || 'text'
  }

  const roomMessages = messages.get(req.params.id) || []
  roomMessages.push(message)
  messages.set(req.params.id, roomMessages)

  io.emit('message:received', message)
  res.json(message)
})

app.post('/api/chat/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const message = {
    id: uuidv4(),
    content: req.body.content || '',
    author: req.user.name,
    authorEmail: req.user.email,
    timestamp: new Date().toISOString(),
    type: req.body.type || 'file',
    fileUrl: `/uploads/${req.file.filename}`,
    fileName: req.file.originalname
  }

  const roomMessages = messages.get(req.body.roomId) || []
  roomMessages.push(message)
  messages.set(req.body.roomId, roomMessages)

  io.emit('message:received', message)
  res.json(message)
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Serve uploaded files
app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
