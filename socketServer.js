// require node packages
const webSocketServerPort = 8500
const webSocketServer = require('websocket').server
const http = require('http')

// instantiate http and socket servers
const server = http.createServer()
server.listen(webSocketServerPort)
console.log('sockets running on 8.5k')

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {}

// generate random number id for each user
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4()
}

wsServer.on('request', (request) => {
    const userID = getUniqueID()
    console.log((new Date()) + 'New connection from origin ' + request.origin + '.')

    const connection = request.accept(null, request.origin)
    clients[userID] = connection
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
})

// send messages to all clients connected to the socket
for(key in clients) {
    clients[key].sendUTF(message.utf8Data)
    console.log('sent Message to: ', clients[key])
}

