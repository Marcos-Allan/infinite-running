const { WebSocketServer } = require('ws')
const dotenv  = require('dotenv')

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

const connections = []

wss.on('connection', (ws) => {

    connections.push(ws)

    ws.on('error', console.error)

    ws.on('message', (data) => {
        console.log(data.toString())
        // wss.clients.forEach((client) => client.send(data.toString()))
        const msg = {
            peoples : connections.length.toString(),
            data : data.toString()
        }
        wss.clients.forEach((client) => client.send(JSON.stringify(msg)))
    })

    ws.on('close', (data) => {
        // Remove a conexão fechada do array
        connections.splice(connections.indexOf(ws), 1);
        console.log('Conexão fechada. Total de conexões: ', connections.length);

        const msg = {
            peoples : connections.length.toString(),
            data : data.toString()
        }

        wss.clients.forEach((client) => client.send(JSON.stringify(msg)))
    });

    console.log(`mais um jogador entrou na sala agora tem ${connections.length} jogadores`)
})