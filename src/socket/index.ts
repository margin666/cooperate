import {io} from 'socket.io-client'
const socket = io('ws://localhost:8022')

socket.on('connect', () => {
    // console.log(socket.id)
    
    
    
})

socket.on('push', (data) => {
    console.log(data)
})

setTimeout(() => {
    socket.emit('msg',{
        data: 'aas'
    })
}, 1000)

