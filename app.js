'use strict'

import morgan from 'morgan'
import express from 'express'
import sanitizeMongo from 'express-mongo-sanitize'
import studentRouter from './routes/students.js'
import courseRouter from './routes/courses.js'
import authRouter from './routes/auth/index.js'

import connectDatabase from './startup/connectDatabase.js'
connectDatabase()

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())

// routes
app.use('/auth', authRouter)
app.use('/api/students', studentRouter)
app.use('/api/courses', courseRouter)

export default app
