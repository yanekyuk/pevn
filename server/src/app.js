var path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')

var port = process.env.PORT || 8082

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

sequelize.sync().then(() => {
  app.listen(port)
  console.log(`Server started on port ${port} and this is the env ${process.env.NODE_ENV}`)
})
