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
////////////////////////////////////////////////////////////

class Lister {
    constructor(namespace) {
        this.instance = io.of(namespace)
    }
    connect(callback) {
        this.instance.on('connection', callback)
    }
    emit(method, content) {
        this.instance.emit(method, JSON.stringify(content))
    }
}


class Store {
    constructor() {
        this.instance = new Map()
    }
    createRoom(roomID, admin,roomname, version = 0, doc = '') {
        
        const obj = {
            id: roomID,
            roomname
        }
        this.instance.set(obj, {
            admin,
            version,
            doc,
            peoples: [],
            updates: []
        })
        return obj
    }
    getStore(roomID){
        for(let arr of this.instance){
            if(arr[0].id === roomID){
                return arr[1]
            }
        }
        return []
    }
}



const centerStore = new Store()
const socketStore = new Map()
const ser = new Lister('system')
ser.connect(socket => {
    console.log('有链接')
    socket.emit('isconnection', true)
    socket.on('createRoom', res => {
        const { roomName, version,admin } = JSON.parse(res)
        const roomID = getRoomID()
        let roomInfo = centerStore.createRoom(roomID, admin, roomName, version)
        socket.join(roomID)
        socket.emit('roomInfo', JSON.stringify(roomInfo))

    })
    socket.on('StoreInfo', res => {
        const {roomID} = JSON.parse(res)
        let store = centerStore.getStore(roomID)
        socketStore.set(socket, store)
        socket.emit('getStore', JSON.stringify(store))
    }) 
    

    socket.on('addRoom', res => {
        const {roomID, userinfo} = JSON.parse(res)
        let store = centerStore.getStore(roomID)
        store.peoples.push(userinfo)
        socketStore.set(socket, store)
        socket.join(roomID)
        socket.emit('getStore', JSON.stringify(store))

    })

    socket.on('pushDate', data => { 
        const { updates, version } = JSON.parse(data)
        let store = socketStore.get(socket)
        store.updates.push(updates)
        const roomID = Array.from(socket.rooms)[1]
        ser.instance.to(roomID).emit('dates', JSON.stringify({ states: updates }))


    })
    socket.on('getStore2', _ => {
        let store = socketStore.get(socket)
        socket.emit('getStore', JSON.stringify(store))
    })

    socket.on('disconnect', () => {
        socketStore.delete(socket)
    })
})
















//////////////////////////////////////////////////////////





app.use(async (ctx) => {
    if (ctx.url === '/') {
        ctx.response.body = '112'
    }
})
httpServer.listen(8022)