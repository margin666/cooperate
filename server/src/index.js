import Koa from 'koa'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { useHourse, useUser } from './utils/other.js'

const app = new Koa()
const httpServer = createServer(app.callback())
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

const hourseMap = new Map()

////////////////////////////////////////////////////////////

class Lister {
    constructor(namespace) {
        this.instance = io.of(namespace)
    }
    connect(callback) {
        this.instance.on('connection', callback)
    }
}

const ser = new Lister('system')
ser.connect(socket => {
    console.log('有链接')

    socket.on('createHourse', data => {
        const {hourseName} = JSON.parse(data)
        socket.join(hourseName)
        console.log(socket.rooms)

    })
    socket.on('insertHourse', data => {
        const {hourseName} = JSON.parse(data)

    })


    socket.on('disconnect', () => {
        console.log('有断开')
    })
})
















//////////////////////////////////////////////////////////





app.use(async (ctx) => {
    if (ctx.url === '/') {
        ctx.response.body = '112'
    }
})
httpServer.listen(8022)