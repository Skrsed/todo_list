const express = require('express')
const cors = require("cors")
const { Sequelize } = require('sequelize')
const keys = require("./keys")
const dotenv = require('dotenv')

const app = express()

const port = 5000

const sequelize = new Sequelize('postgres://postgres:postgres@localhost', {
  dialect: 'postgres',
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: '5432'
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

dotenv.config()

app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/todo', require('./routes/todo'))
app.use('/api/v1/user', require('./routes/user'))

app.listen(port, () => {
  console.log(`TODOs app listening at http://localhost:${port}`)
})