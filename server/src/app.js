const express = require('express')
const http = require('http')
const cors = require('cors')

const indexRouter = require('./routes/index')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/', indexRouter)

const port = process.env.PORT || 4000
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

module.exports = app