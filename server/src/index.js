import Koa from 'koa'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { useHourse, useUser } from './utils/other.js'
const getRoomID = useHourse('ROOM')

const app = new Koa()
const httpServer = createServer(app.callback())
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

const hourseMap = new Map()

const versionStore = []
function storeInsert(item){
    let store = versionStore['room']
    const {version, item:updates} = item
    if(store.has(version)){
        let s = store.get(version)
        s.push(updates)
    }else{
        store.set(version, [updates])
    }
}
////////////////////////////////////////////////////////////

class Lister {
    constructor(namespace) {
        this.instance = io.of(namespace)
    }
    connect(callback) {
        this.instance.on('connection', callback)
    }
    emit(method, content){
        this.instance.emit(method, JSON.stringify(content))
    }
}

const ser = new Lister('system')
ser.connect(socket => {
    console.log('有链接')
    socket.on('pushDate', data => {
        const {updates, version} = JSON.parse(data)
        versionStore.push(updates)
        // console.log(versionStore)
        ser.emit('dates', {states:updates})
        // storeInsert({version,item})
        
    })

    // socket.on('test', r => {
    //     console.log(r)
    //     ser.instance.emit('test2', r)
    // })
    

    



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