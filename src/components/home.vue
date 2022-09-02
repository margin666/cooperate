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
                <input placeholder="请输入房间ID" type="text">
                <button>加入房间</button>
            </div>
            <button @click="createHourse">创建房间</button>
            <button>运行代码</button>
            <div class="user">
                <i></i>
                <input placeholder="请输入你的昵称" type="text">
            </div>
            <div class="status">
                <div @click="changeStatus" id="switch" class="switch"
                    :style="{ backgroundColor: status ? '#42E83A' : '#FF493F' }">
                    <div :style="{ marginLeft: status ? '26px' : '1px', }" class="block"></div>
                </div>
                <label>{{ status ? '连接' : '断开' }}</label>
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
import { ref, nextTick, watchEffect } from 'vue';
import { pick } from '../theme/pick';
import Dialog from './Dialog.vue';
import { Server } from '../socket/index'
import { useUser } from '../utils/other'
// @ts-ignore
import { javascript } from "@codemirror/lang-javascript";
import { EditorSelection, EditorState } from '@codemirror/state';
import {collab} from '@codemirror/collab';
const edit = ref<HTMLDivElement>();

let view:EditorView | null = null




nextTick(() => {
    
    view = new EditorView({
        doc: '这是',
        extensions: [basicSetup, pick, keymap.of([indentWithTab]), javascript()],
        parent: edit.value,


    })
   
})

const status = ref<boolean>(false)

const dialogStatus = ref<Boolean>(false)
const createHourse = () => {
    changeDialogStatus(true)
}

const changeDialogStatus = (status: boolean) => {
    dialogStatus.value = status
}


let serve:Server | null = null
function changeStatus(){
    status.value = !status.value
    if(status.value){
        serve = new Server('ws://localhost:8022/system')
    }else{
        serve?.close()
    }
}


const putHourseInfo = (name: string) => {
    if(!serve)return
    serve.emit('createHourse', {
        hourseName: name
    })
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

        .status {
            margin-left: 20px;
            width: 100px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .switch {
                width: 50px;
                height: 20px;
                border-radius: 10px;
                // background-color: #fff;
                transition: all 0.5s;

                .block {
                    margin-top: 1px;
                    width: 23px;
                    height: 18px;
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