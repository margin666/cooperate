<template>
    <header>cooperation</header>
    <aside>
        <div class="empty" v-if="false">
            <p class="info">暂无可加入的房间</p>
            <button class="handle">创建房间</button>
        </div>
        <div class="hourse" v-if="true">
            <p class="title">
                <span>ID:10086</span>
                <span>DATE:12:12:12</span>
            </p>
            <p class="names">张三；李四；王麻子；张三；李四；王麻子；张三；李四；王麻子；张三；李四；王麻子；张三；李四；王麻子；</p>
            <div class="box">
                <p class="people">people:23</p>
                <button>进入 <i></i></button>
            </div>
        </div>
    </aside>
    <div class="body">
        <article class="btns">

            <div class="search">
                <i></i>
                <input v-model="roomID" placeholder="请输入房间ID" type="text">
                <button @click="addRoom">加入房间</button>
            </div>
            <button @click="createHourse">创建房间</button>
            <button>运行代码</button>
            <div class="user">
                <i></i>
                <input :disabled="disname" @mouseleave="handleOut" v-model="userinfo.username"
                    placeholder="请输入你的昵称(仅可输入一次)" type="text">
            </div>
            <i class="status-connect" :style="{ backgroundColor: connectStatus ? '#42E83A' : '#FF493F' }"></i>
            <div class="status">
                <div @click="changeSyncStatus" id="switch" class="switch"
                    :style="{ backgroundColor: syncStatus ? '#42E83A' : '#FF493F' }">
                    <div :style="{ marginLeft: syncStatus ? '16px' : '1px', }" class="block"></div>
                </div>
                <label>{{ syncStatus ? '同步' : '暂停' }}</label>
            </div>
        </article>
        <div class="edit" ref="edit"></div>
    </div>
    <Dialog @createHourse="putHourseInfo" @changeStatus="changeDialogStatus" :open="(dialogStatus as boolean)"></Dialog>
</template>
<script lang="ts" setup>
import { EditorView, basicSetup } from 'codemirror';
import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { ref, nextTick, reactive } from 'vue';
import { pick } from '../theme/pick';
import Dialog from './Dialog.vue';
import { Server } from '../socket/index'
import { useUser } from '../utils/other'
// @ts-ignore
import { javascript } from "@codemirror/lang-javascript";
import { EditorSelection, EditorState, ChangeSet, Text } from '@codemirror/state';
import { collab, Update, getSyncedVersion, receiveUpdates, sendableUpdates } from '@codemirror/collab';
import { setListener, pack, Dep } from '../edit/index'
import { emit } from 'process';
const edit = ref<HTMLDivElement>();
let serve = new Server('ws://localhost:8022/system')
let view: EditorView | null = null
let startVersion = 0
const userinfo = reactive<{
    username: string;
    userID: string;
}>({
    username: '',
    userID: ''
})

const connectStatus = ref<boolean>(false)
serve.on('isconnection', () => {
    connectStatus.value = true
    console.log('已连接')
})


const disname = ref<boolean>(false)
const handleOut = () => {
    if (userinfo.username.trim() === '') {
        userinfo.username = ""
        return
    }
    disname.value = true
    userinfo.userID = useUser()
}



const dispatch = async (value: any) => {
    view?.dispatch(receiveUpdates(view.state, [{
        changes: ChangeSet.fromJSON(value!.changes),
        clientID: value!.clientID
    }]))
}

let disConnectTemp: storeItem[] = []


type storeItem = {
    _type?: string;
    clientID: string;
    changes: any;
}
let local = new Dep<storeItem>(async (value: storeItem) => {
    if ('_type' in value) {
        // console.log(value)
        serve.emit('pushDate', {
            version: startVersion,
            updates: {
                clientID: value.clientID,
                changes: value.changes,
            }
        })
    } else {
        await dispatch(value)
    }

})

let updates = pack([], (item) => {
    if (item.update.length === 0) return
    if (startVersion !== item.version) {
        startVersion = item.version
    }
    const update = item.update.slice(-1)
    if (syncStatus.value) {
        local.push({
            _type: 'local',
            clientID: update[0].clientID,
            changes: update[0].changes.toJSON()
        })
    } else {
        disConnectTemp.push({
            _type: 'local',
            clientID: update[0].clientID,
            changes: update[0].changes.toJSON()
        })
    }

    // serve.emit('pushDate', {
    //     version: startVersion,
    //     updates: {
    //         clientID: update[0].clientID,
    //         changes: update[0].changes.toJSON()
    //     }
    // })



})




const plugin = setListener(updates, (v) => {
    const version = getSyncedVersion(v.state)
    serve.emit('getdates', { version: version, })


})




serve.on('dates', (data) => {
    const { states } = data
    // console.log(states)
    // Object.assign(states, {changes: ChangeSet.fromJSON(states.changes),})
    local.push(states)
})



nextTick(() => {
    view = new EditorView({
        doc: '',
        extensions: [basicSetup, collab({ startVersion }), pick, keymap.of([indentWithTab]), javascript(), plugin],
        parent: edit.value,
    })

    // serve.on('dates', (res: string) => {
    //     let { states } = JSON.parse(res)
    //     view?.dispatch(receiveUpdates(view.state, [{
    //         changes: ChangeSet.fromJSON(states!.changes),
    //         clientID: states!.clientID
    //     }]))
    // })

})


const syncStatus = ref<boolean>(false)
const changeSyncStatus = function () {
    syncStatus.value = !syncStatus.value
    if (syncStatus.value) {
       
        serve.emit('getStore2', {})
        disConnectTemp.forEach(el => {
            serve.emit('pushDate', {
                version: startVersion,
                updates: {
                    clientID: el.clientID,
                    changes: el.changes,
                }
            })
        })
        disConnectTemp = []

    }
}



const dialogStatus = ref<Boolean>(false)

const changeDialogStatus = (status: boolean) => {
    dialogStatus.value = status
}
const createHourse = () => {
    let name = userinfo.username.trim()
    if (name === '') {
        alert('请先输入用户名')
        return
    }
    changeDialogStatus(true)
}







const putHourseInfo = (name: string) => {
    if (!serve) return
    serve.emit('createRoom', {
        roomName: name,
        version: startVersion,
        admin: {
            name: userinfo.username,
            ID: userinfo.userID,
        }
    })
    syncStatus.value = true
    changeDialogStatus(false)
}

const roomInfo = reactive<{
    id?: string;
    roomname?: string;
}>({})
serve.on('roomInfo', res => {
    console.log(res)
    const { id, roomname } = res as {
        id?: string;
        roomname?: string;
    }
    roomInfo.id = id
    roomInfo.roomname = roomname
    serve.emit('StoreInfo', {roomID: id})
})
serve.on('getStore', (data) => {
    console.log(data)
    const {updates:store} = data
    // console.log(store)
    if (Array.isArray(store) && store.length !== 0) {
        local.data = store
        store.forEach(el => {
            dispatch(el)
        })
    }
})


const roomID = ref<string>('')
const addRoom = () => {
    let name = userinfo.username.trim()
    if (name === '') {
        alert('请先输入用户名')
        return
    }
    serve.emit('addRoom', {
        roomID: roomID.value.trim(),
        userinfo:{
            name: userinfo.username,
            ID: userinfo.userID,
        }
    })
    syncStatus.value = true
}

</script>
<style lang="scss" scoped>
@mixin bgc() {
    background-image: linear-gradient(to right, #F94A72, #F22D62);
}

@mixin bg($url) {
    background-image: url($url);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 100% 100%;
}


$fontColor: #FA5075;
$bgl: #F94A72;
$bgr: #F22D62;
$borderc: #E53F69;

header {
    width: 100%;
    height: 10vh;
    font-weight: 600;
    font-style: italic;
    color: $fontColor;
    font-size: 4rem;
    line-height: 10vh;
    padding: 0 20px;
}

aside {
    width: 350px;
    height: 90vh;
    display: inline-block;
    vertical-align: top;
    padding: 10px;
    overflow: auto;


    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(47, 21, 50, 0.62);
        border-radius: 3px;
        overflow: hidden;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        @include bgc();
    }

    .empty {
        width: 100%;
        height: 100%;
        padding: 10px 20px;
        border-radius: 5px;
        border: 0px solid $borderc;
        cursor: pointer;
        user-select: none;
        text-align: center;

        .info {
            color: #999;
            font-weight: 600;
            font-size: 1.4rem;
            text-align: center;
            width: 100%;
            line-height: 5rem;
        }

        .handle {
            color: #fff;
            font-weight: 600;
            font-size: 1.6rem;
            text-align: center;
            border-radius: 5px;
            border: 0;
            padding: 5px 20px;
            cursor: pointer;
            text-decoration: underline;
            @include bgc();
        }
    }

    .hourse {
        width: 100%;
        padding: 10px 20px;
        border-radius: 5px;
        border: 1px solid $borderc;
        cursor: pointer;
        user-select: none;
        margin-bottom: 10px;

        &:hover {
            box-shadow: inset 0px 0px 15px 1px rgba(255, 255, 255, 0.291);
        }

        >.title {
            display: flex;
            align-items: center;
            justify-content: space-between;

            >span {
                font-size: 1rem;
                color: #fff;
            }
        }

        >.names {
            color: $fontColor;
            font-size: 0.8rem;
            width: 100%;
            line-height: 20px;
            max-height: 70px;
            padding: 10px 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .box {
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;

            >.people {
                font-weight: 600;
                color: #fff;
                font-size: 1rem;
                max-width: 100px;
                // flex: 1;
            }

            button {
                font-size: 1rem;
                color: #fff;
                border-radius: 4px;
                border: 0;
                cursor: pointer;
                font-weight: 600;
                padding: 3px 8px;
                // padding: 15px 5px;
                @include bgc();

                i {
                    display: inline-block;
                    @include bg('../assets/in.png');
                    width: 1rem;
                    height: 1rem;
                    // line-height: 2rem;
                }
            }
        }

    }
}

.body {
    width: calc(100vw - 350px);
    display: inline-block;
    vertical-align: top;
    height: 90vh;

    >.btns {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        padding: 0 20px;

        >.user {
            margin-left: 20px;
            display: flex;
            align-items: center;
            overflow: hidden;

            >i {

                @include bg('../assets/user.png');
                width: 2rem;
                height: 2rem;
                margin: 0 5px;
            }

            >input {
                width: 200px;
                border: 0;
                color: #fff;
                font-size: 1.2rem;
                line-height: 2.6rem;
                letter-spacing: 2px;
                background-color: transparent;

                outline: 0;

                &:focus {
                    border-bottom: 2px solid $borderc;
                }
            }
        }

        >.search {
            width: 300px;
            border-radius: 20px;
            border: 2px solid $borderc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            // padding: 5px 8px;
            overflow: hidden;


            >i {

                @include bg('../assets/search.png');
                width: 2rem;
                height: 2rem;
                margin-left: 5px;
            }

            >input {
                width: calc(100% - 12rem);
                border: 0;
                color: #fff;
                font-size: 1.2rem;
                letter-spacing: 2px;
                background-color: transparent;
                outline: 0;
            }

            >button {
                @include bgc();
                border: 0;
                color: #fff;
                padding: 5px 10px;
                border-radius: 0 20px 20px 0;
                letter-spacing: 3px;
                font-size: 1rem;
                cursor: pointer;
            }
        }

        >button {
            @include bgc();
            border: 0;
            color: #fff;
            padding: 5px 10px;
            border-radius: 3px;
            letter-spacing: 3px;
            font-size: 1rem;
            cursor: pointer;

            +& {
                margin-left: 20px;
            }
        }

        .status-connect {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 15px;
        }

        .status {
            margin-left: 20px;
            width: 70px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .switch {
                width: 32px;
                height: 14px;
                border-radius: 10px;
                // background-color: #fff;
                transition: all 0.5s;

                .block {
                    margin-top: 1px;
                    width: 15px;
                    height: 12px;
                    border-radius: 10px;
                    background-color: #2A0D2E;
                    margin-left: 1px;
                    transition: all 0.5s;
                }
            }

            label {
                font-size: 1.4rem;
                color: white;
            }

        }
    }

    >.edit {
        width: calc(100% - 20px);
        margin: 10px;
        height: calc(90vh - 70px);
        border: 1px solid $borderc;
        border-radius: 5px;
        overflow: hidden;
    }
}
</style>