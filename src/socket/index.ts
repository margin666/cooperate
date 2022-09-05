import {io} from 'socket.io-client'
import type {Socket} from 'socket.io-client'



type callbackType = (data:string) =>void
export class Server{
    private instance:Socket;
    constructor(url:string){
        this.instance = io(url)
    }
    close(){
        this.instance.disconnect()
    }
    emit(type:string, data:any){
        this.instance.emit(type,JSON.stringify(data))
    }
    on(type:string, callback:callbackType){
        this.instance.on(type, callback)
    }
}



