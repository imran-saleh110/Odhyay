import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
import { connectDB } from './src/config/database.js'
import questionsRouter from './src/routes/questions.js'
import authRouter from './src/routes/auth.js'
import usersRouter from './src/routes/users.js'
import examRoutes from './src/routes/examRoutes.js'
import dns from 'dns'

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Dotenv
dotenv.config()

// App config
const app = express()
const port = process.env.PORT || 4000
app.use(express.json())
app.use(cookieParser())

// Setting up a listener for our server
app.listen(port, () => {
  console.log('server started on port: ' + port);
})

// Connect to MongoDB
connectDB()

///////////////////API Endpoints///////////////////////

// Authentication APIs
app.use('/api/auth', authRouter)


// Authorization APIs
app.use('/api/users', usersRouter)


// Question related APIs
app.use('/api/questions', questionsRouter)

//Exam related APis
app.use("/api/exam", examRoutes)