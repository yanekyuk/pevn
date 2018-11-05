const express = require('express')
const history = require('connect-history-api-fallback')
const serveStatic = require('serve-static')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

var app = express()
app.use(history())
app.use(serveStatic(path.join(__dirname, 'dist')))

const port = process.env.PORT || 8080
app.listen(port)
console.log(`Server started on port ${port}, in ${process.env.NODE_ENV}`)
