import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.js'
import listingRoutes from './routes/listing.js'
import loginRoutes from './routes/login.js'

// Defining app instance
const app = express()

// Middleware

// Open CORS for development
app.use(cors())

// Parse JSON requests for req.body
app.use(express.json())

// Middleware for user-search routes
app.use('/users', userRoutes)

// Middleware for listings routes
app.use('/listings', listingRoutes)

// Middleware for login routes
app.use('/login', loginRoutes)

// Default route i.e. login page - is this necessary?
app.get('/', (req, res) => res.send({info: "Talent Forge API"}))


export default app