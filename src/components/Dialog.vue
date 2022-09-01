<template>
    <dialog :open="open" @click.self="handleDialog">
        <div class="content">
            <header>创建房间</header>
            <form action="" onsubmit="return false">
                <label for="id">请输入房间名：</label>
                <input name="name" v-model="hoursename" id="id" type="text">
            </form>
            <footer>
                <button @click="createHourse">创建</button>
            </footer>
        </div>
    </dialog>
</template>

<script lang="ts" setup>
    import {ref} from 'vue'
defineProps({
    open: {
        type: Boolean,
        required: false,
        default: false,
    }
})

const emit = defineEmits(['changeStatus', 'createHourse'])
const hoursename = ref<string>('')
const handleDialog = () => {
    emit('changeStatus', false)
    hoursename.value = ''
}
const createHourse = () => {
    emit('createHourse',hoursename.value )
}

</script>

<style lang="scss" scoped>
$fontColor: #FA5075;
$bgl: #F94A72;
$bgr: #F22D62;
$borderc: #E53F69;
@mixin bgc() {
    background-image: linear-gradient(to right, #F94A72, #F22D62);
}

dialog {
    width: 100vw;
    height: 100vh;
    background-color: #2a0d2e8c;
    top: 0;
    z-index: 999;

    .content {
        max-width: 400px;
        border: 1px solid $borderc;
        border-radius: 5px;
        padding:10px 15px;
        margin: 0 auto;
        margin-top: 20vh;

        header {
            color: antiquewhite;
            font-size: 1.2rem;
            line-height: 3rem;
            // border-bottom: 1px solid #e53f68aa;
        }

        form {
            padding: 20px 0;
            // min-height: 150px;
            label {
                color: $fontColor;
                font-size: 1.4rem;
            }

            input {
                width: 200px;
                border: 0;
                color: #fff;
                font-size: 1.2rem;
                line-height: 2rem;
                letter-spacing: 2px;
                background-color: transparent;
                border-bottom: 2px solid $borderc;
                outline: 0;
            }
            
        }
        footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            >button {
                @include bgc();
                border: 0;
                color: #fff;
                padding: 5px 10px;
                border-radius: 5px;
                letter-spacing: 3px;
                font-size: 1rem;
                cursor: pointer;
            }
        }
    }
}
</style>