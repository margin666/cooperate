import Koa from 'koa'
import {createServer} from 'http'
import {Server} from 'socket.io'

const app = new Koa()
const httpServer = createServer(app.callback())
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    
    socket.emit('push', 'server: ')
    socket.on('msg', (data) => {
        console.log(data)
        
    })
    
})






app.use(async (ctx) => {
    if(ctx.url === '/'){
        ctx.response.body = '112'
    }
})
httpServer.listen(8022)