const { WebSocketServer } = require('ws')
const dotenv  = require('dotenv')

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

const connections = []
let names = []

wss.on('connection', (ws) => {

    connections.push(ws)

    ws.on('error', console.error)
    
    ws.on('message', (event) => {
        const data = JSON.parse(event)
        console.log(data.name)
        names.push(`${connections.length.toString()}: ${data.name}`)
        const msg = {
            peoples : connections.length.toString(),
            data : event.toString(),
            names : names.toString()
        }
        wss.clients.forEach((client) => client.send(JSON.stringify(msg)))
    })

    ws.on('close', (data) => {
        // Remove a conexão fechada do array
        connections.splice(connections.indexOf(ws), 1);
        console.log('Conexão fechada. Total de conexões: ', connections.length);
        
        if(connections.length == 0){
            names = []
        }
        
        if(connections.length == 1){
            names.filter((person) => person.split(':')[0] != connections.length)
            console.log('joagador desconectado')
        }
        
        const msg = {
            peoples : connections.length.toString(),
            data : data.toString(),
            names : names.toString()
        }

        wss.clients.forEach((client) => client.send(JSON.stringify(msg)))
    });

    console.log(`mais um jogador entrou na sala agora tem ${connections.length} jogadores`)
})