/**
 * Module dependencies.
 */
require('dotenv').config()
var app = require('./app')
var http = require('http')
var fs = require('fs')

// 当前进程抛出一个没有被捕捉的异常时，会触发uncaughtException事件
process.on("uncaughtException", (err) => fs.appendFileSync('./logs/uncaughtException.log', `${new Date().toLocaleString()} --- ${err} --- ${__filename}\n`, 'utf8'));

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || process.env.DEBUG_PORT)
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10)

    if (isNaN(port)) return val

    if (port >= 0) return port

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') throw error

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port
    console.log('Listening on ' + bind)
}

module.exports = server