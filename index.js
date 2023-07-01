const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const utils = require('util')
const formidable = require('formidable')
const fs = require('fs')
const db = require('./db')
const userRouter = require('./routes/user-router')
const noteRouter = require('./routes/note-router')
const recipeRouter = require('./routes/recipe-router')
const dashboardRouter = require('./routes/dashboard-router');

const app = express()
const apiPort = 5000

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('public/uploads'))

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// app.get('/', (req, res) => {
//     res.send('Hello Notify Developers!')
// })

app.use('/api', userRouter)

app.use('/api', noteRouter)

app.use('/api', recipeRouter)

app.use('/api', dashboardRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))